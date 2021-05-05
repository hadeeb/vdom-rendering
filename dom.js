//@ts-check
/**
 * @typedef VNode
 * @type {import("./createElement").VNode}
 */

import { isTextNode, isSVG } from "./utils.js";

/**
 * Create a DOM element and attach it to parent DOM element
 * @param {VNode} vnode virtual node to create a DOM node for
 * @param {HTMLElement|SVGElement|Text} domElement parent DOM element of the node
 * @param {VNode} prevVNode previous virtual node
 * @param {number} position position of node in the parent DOM
 */
function addToDOM(vnode, domElement, prevVNode, position) {
  // If position is not defined,
  // new elements will be added to the end of the DOM element

  const dom = createDOMElement(vnode, prevVNode);

  if (prevVNode.dom && dom !== prevVNode.dom) {
    // not initial render and DOM element has changed,
    // Replace with new DOM element
    prevVNode.dom.replaceWith(dom);
  }

  if (!prevVNode.dom || position != null) {
    // Initial render
    // OR
    // position has changed, see diff-children.js L#41
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
    // Create DOM node
    return isTextNode(vnode)
      ? // In text nodes, props contains the text content
        // see utils.js L#17
        document.createTextNode(vnode.props)
      : isSVG(vnode)
      ? /**@type {SVGElement} */ (document.createElementNS(
          "http://www.w3.org/2000/svg",
          /**@type {string}*/ (vnode.type),
          { is: vnode.props.is }
        ))
      : document.createElement(/**@type {string}*/ (vnode.type), {
          is: vnode.props.is,
        });
  }
}

export { addToDOM };
