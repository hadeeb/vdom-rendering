import { h, render, useEffect, useState, unmount } from "./index.js";

function Counter() {
  // component state
  const [count, setState] = useState(0);

  // Effects
  useEffect(() => {
    const id = setTimeout(() => {
      setState(count => count + 1);
    }, 1500);
    return () => {
      clearTimeout(id);
    };
  }, []);

  return h(
    "div",
    // props can be null
    null,
    h(
      "button",
      {
        // event listener
        onClick: () => {
          setState(x => x + 1);
        },
        name: "button"
      },
      count
    ),
    // passing children to components
    h(Clock, {}, "QWERTY")
  );
}

function Clock({ children }) {
  const [currentTime, setState] = useState(Date.now);

  // multiple effect hooks
  useEffect(() => {
    const id = setInterval(() => {
      setState(Date.now());
    }, 1000);

    return () => {
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    console.log("Mounted");
    return () => {
      console.log("Unmounted");
    };
  }, []);

  return h(
    "div",
    null,
    new Date(currentTime).toTimeString(),
    // rendering an array
    children
  );
}

// Attach to window object for inspection
window.vnode = render(
  h(
    "div",
    { className: "wrapper" },
    // a string as child
    "A string",
    // another component as child
    h(Counter)
  ),
  document.getElementById("app")
);

window.render = render;

window.unmount = unmount;

console.log(
  "vnode, render and unmount are attached to window.\nAccess them as window.vnode,window.render,etc"
);
