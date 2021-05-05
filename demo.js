import htm from "https://unpkg.com/htm@3.0.4?module";
import { h, render, useEffect, useState, unmount } from "./index.js";
const html = htm.bind(h);

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

  return html`<div className="parent">
    Parent Component
    <div>State : ${count}</div>
    <button
      onClick=${() => {
        setState((x) => x + 1);
      }}
    >
      Update parent
    </button>
    <${Child} key=${count % 2}>${count}</${Child}>
    <svg width="8" height="14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1 13l6-6-6-6"
        stroke="#8BA6C1"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    <${Child} key=${(count + 1) % 2}>${count}</${Child}>
  </div>`;
}

function Child({ children }) {
  const [count, setState] = useState(0);

  useEffect(() => {
    console.log("Child mounted");
    return () => {
      console.log("Child unmounted");
    };
  }, []);

  return html`<div className="child">
    Child Component
    <div>State : ${count}</div>
    <div>Props : ${children}</div>
    <button
      name="button"
      onClick=${() => {
        setState((x) => x + 1);
      }}
    >
      Update child
    </button>
  </div>`;
}

// Attach to window object for inspection
window.vnode = render(html`<${Counter} />`, document.getElementById("app"));

window.h = h;

window.render = render;

window.unmount = unmount;

console.log(
  "vnode, render, h and unmount are attached to window.\nAccess them as window.vnode,window.render,etc"
);
