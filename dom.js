/**
 * @typedef VNode
 * @type {import("./createElement").VNode}
 */

import { isTextNode } from "./utils.js";

/**
 * Create a DOM element and attach it to parent DOM element
 * @param {VNode} vnode virtual node to create a DOM node for
 * @param {HTMLElement} domElement parent DOM element of the node
 * @param {VNode} prevVNode previous virtual node
 * @param {number} position position of node in the parent DOM
 */
function addToDOM(vnode, domElement, prevVNode, position) {
  // If position is not defined,
  // new elements will be added to the end of the DOM element

  const dom = createDOMElement(vnode, prevVNode);

  if (dom !== prevVNode.dom || position != null) {
    // the DOM element is newly created
    // OR
    // position has changed
    domElement.insertBefore(dom, domElement.childNodes[position + 1]);
  }

  return dom;
}

/**
 * Create a DOM element if necessary, or return the previous element
 * @param {VNode} vnode
 * @param {VNode} prevVNode
 */
function createDOMElement(vnode, prevVNode) {
  // During initial render, prevVNode.type will be undefined
  // So, this condition will be false
  if (prevVNode.type === vnode.type) {
    // vnode type has not changed
    // use the previous DOM element
    return prevVNode.dom;
  } else {
    if (prevVNode.dom) {
      // During initial render, prevVNode.dom will be undefined
      // So, this condition will be false

      // Remove the previous DOM element
      prevVNode.dom.remove();
    }

    // Create DOM node
    return isTextNode(vnode)
      ? // In text nodes, props contains the text content
        // see utils.js L#17
        document.createTextNode(vnode.props)
      : document.createElement(vnode.type);
  }
}

export { addToDOM };
