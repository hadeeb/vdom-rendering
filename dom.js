// @ts-check
/**
 * @typedef VNode
 * @type {import("./createElement").VNode}
 */

import { isTextNode } from "./utils.js";

/**
 * Create a DOM element and attach it to parent DOM element
 * @param {VNode} vnode virtual node to create a DOM node for
 * @param {HTMLElement|Text} domElement parent DOM element of the node
 * @param {VNode} prevVNode previous virtual node
 * @param {number} position position of node in the parent DOM
 */
function addToDOM(vnode, domElement, prevVNode, position) {
  // If position is not defined,
  // new elements will be added to the end of the DOM element

  const dom = prevVNode.dom ?? createDOMElement(vnode);

  if (dom !== prevVNode.dom || position != null) {
    // Initial render
    // OR
    // position has changed, see diff-children.js L#41
    domElement.insertBefore(dom, domElement.childNodes[position + 1]);
  }

  return dom;
}

/**
 * Create a DOM element
 * @param {VNode} vnode
 */
function createDOMElement(vnode) {
  return isTextNode(vnode)
    ? // In text nodes, props contains the text content
      // see utils.js L#17
      document.createTextNode(vnode.props)
    : document.createElement(/**@type {string}*/ (vnode.type));
}

export { addToDOM };
