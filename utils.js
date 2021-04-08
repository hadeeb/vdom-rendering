/**
 * @typedef VNode
 * @type {import("./createElement").VNode}
 */

import { invokeEffectCleanup } from "./hooks.js";
import { TEXT_NODE, h } from "./createElement.js";

/**
 * Converts string/number/null values to VNode
 * @param {any} vnode
 * @returns {VNode}
 */
function ensureVNode(vnode) {
  vnode = vnode != null && typeof vnode !== "boolean" ? vnode : "";
  if (typeof vnode !== "object") {
    vnode = h(TEXT_NODE, vnode);
  }
  return vnode;
}

/**
 * Find the DOM element of a Vnode
 * @param {VNode} vnode
 * @returns {HTMLElement|Text}
 */
function findDOMNode(vnode) {
  if (!isComponent(vnode)) return vnode.dom;
  return findDOMNode(vnode.rootVNode);
}

/**
 * Remove a node's DOM element from document,
 * If it a component run all effect cleanups
 * @param {VNode} vnode
 */
function unmount(vnode) {
  const domElement = findDOMNode(vnode);
  domElement.remove();

  // defer the execution
  microTask(() => {
    cleanup(vnode);
  });
}

/**
 * Execute effect cleanups of the component and it's child components
 * @param {VNode} vnode
 */
function cleanup(vnode) {
  if (isComponent(vnode)) {
    cleanup(vnode.rootVNode);
    // Invoke unmount effects
    vnode.hooks.forEach(invokeEffectCleanup);
  } else {
    // Recursively run cleanup for each child node
    vnode.childVNodes.forEach(cleanup);
  }
}

/**
 * Check if a vnode corresponds to a component
 * @param {VNode} vnode
 */
function isComponent(vnode) {
  return typeof vnode.type === "function";
}

/**
 * Check if a vnode is a TextNode
 * @param {VNode} vnode
 * @returns {vnode is import("./createElement.js").TextVNode}
 */
function isTextNode(vnode) {
  return vnode.type === TEXT_NODE;
}

/**
 * Proxy an event to hooked event handlers
 * @param {Event} e The event object from the browser
 */
function eventProxy(e) {
  this.vnodeListeners[e.type](e);
}

const microTask = queueMicrotask;

/**
 * @type {typeof microTask}
 */
const macroTask = setTimeout;

export {
  isComponent,
  isTextNode,
  ensureVNode,
  unmount,
  eventProxy,
  microTask,
  macroTask,
};
