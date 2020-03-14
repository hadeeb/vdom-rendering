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
  vnode = vnode ?? "";
  if (typeof vnode !== "object") {
    vnode = h(TEXT_NODE, vnode);
  }
  return vnode;
}

/**
 * Remove a node's DOM element from document,
 * If it a component run all effect cleanups
 * @param {VNode} vnode
 */
function unmount(vnode) {
  if (isComponent(vnode)) {
    // If it is a component, execute effect cleanups
    unmountComponent(vnode);
  } else {
    // Remove the DOM element
    vnode.dom.remove();

    // Recursively unmount each child node
    vnode.childVNodes.forEach(unmount);
  }
}

/**
 * Execute effect cleanups of the component and remove it's child nodes
 * @param {VNode} vnode
 */
async function unmountComponent(vnode) {
  const hooks = vnode.hooks;
  // Reset `hooks` key to denote vnode is unmounted
  // This is to prevent updating unmounted components
  // see hooks.js L#35
  vnode.hooks = null;

  // Unmount the child nodes
  unmount(vnode.rootVNode);

  // Invoke unmount effects
  // defer the execution
  await Promise.resolve();
  hooks.forEach(invokeEffectCleanup);
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

export { isComponent, isTextNode, ensureVNode, unmount, eventProxy };
