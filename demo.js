import { h, render, useEffect, useState, unmount } from "./index.js";

function Counter() {
  // component state
  const [count, setState] = useState(0);

  // Effects
  useEffect(() => {
    console.log("Parent mounted");
    return () => {
      console.log("Parent unmounted");
    };
  }, []);

  return h(
    "div",
    // Props
    { className: "parent" },
    // Children
    // can be a string
    "Parent Component",
    // or another node
    h(
      "div",
      // props can be null
      null,
      "State : ",
      count
    ),
    h(
      "button",
      {
        // event listener
        onClick: () => {
          setState(x => x + 1);
        },
        name: "button"
      },
      "Update parent"
    ),
    // passing children to components
    // Keyed children
    // Swap position on each update to count
    h(Child, { key: count % 2 }, count),
    h(Child, { key: (count + 1) % 2 }, count)
  );
}

function Child({ children }) {
  const [count, setState] = useState(0);

  useEffect(() => {
    console.log("Child mounted");
    return () => {
      console.log("Child unmounted");
    };
  }, []);

  return h(
    "div",
    { className: "child" },
    "Child Component",
    h("div", null, "State : ", count),
    h("div", null, "Props : ", children),
    h(
      "button",
      {
        // event listener
        onClick: () => {
          setState(x => x + 1);
        },
        name: "button"
      },
      "Update child"
    )
  );
}

// Attach to window object for inspection
window.vnode = render(h(Counter), document.getElementById("app"));

window.h = h;

window.render = render;

window.unmount = unmount;

console.log(
  "vnode, render, h and unmount are attached to window.\nAccess them as window.vnode,window.render,etc"
);
