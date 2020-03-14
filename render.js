/**
 * @typedef VNode
 * @type {import("./createElement").VNode}
 */

import { ensureVNode, isComponent, isTextNode } from "./utils.js";
import { diffProps } from "./diff-props.js";
import { renderChildren } from "./diff-children.js";
import { renderComponent } from "./component.js";

/**
 * Render a virtual node to DOM
 * @param {VNode} vnode Virtual node to render
 * @param {HTMLElement} domElement DOM element to attach the generated element
 * @param {VNode} [prevVNode] previous virtual node, used for updating
 * @param {number} [position] the position of node in the parent
 * @returns {VNode}
 */
function render(vnode, domElement, prevVNode = {}, position) {
  // If position is not defined,
  // new elements will be added to the end of the DOM element

  // If argument is an array of VNodes
  // loop through them and return the result
  if (Array.isArray(vnode)) {
    return vnode.map((node, i) => render(node, domElement, prevVNode[i]));
  }

  // If vnode is a string/number/null,
  // convert it into a vnode
  vnode = ensureVNode(vnode);

  // Component
  if (isComponent(vnode)) {
    return renderComponent(vnode, domElement, prevVNode, position);
  }

  // DOM elements

  // Create DOM nodes
  if (prevVNode.dom) {
    // Use previous DOM node
    vnode.dom = prevVNode.dom;
  } else {
    // Create DOM node
    vnode.dom = isTextNode(vnode)
      ? // In text nodes, props contains the text content
        // see utils.js L#17
        document.createTextNode(vnode.props)
      : document.createElement(vnode.type);
  }

  // Diff props
  diffProps(vnode, prevVNode);

  // Render children
  renderChildren(vnode, prevVNode);

  if (!prevVNode.dom || position != null) {
    // DOM is not inserted
    // OR
    // position has changed
    domElement.insertBefore(vnode.dom, domElement.childNodes[position + 1]);
  }

  return Object.assign(prevVNode, vnode);
}

export { render };
