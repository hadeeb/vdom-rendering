//@ts-check
/**
 * @typedef VNode
 * @type {import("./createElement").VNode}
 */

import { applyFlags, ensureVNode, isComponent } from "./utils.js";
import { diffProps } from "./diff-props.js";
import { renderChildren } from "./diff-children.js";
import { renderComponent } from "./component.js";
import { addToDOM } from "./dom.js";
import { h } from "./createElement.js";

/**
 * Render a virtual node to DOM
 * @param {VNode} vnode Virtual node to render
 * @param {HTMLElement|SVGElement|Text} domElement DOM element to attach the generated element
 * @param {VNode} [prevVNode] previous virtual node, used for updating
 * @param {number} [position] the position of node in the parent
 * @returns {VNode}
 */
function render(vnode, domElement, prevVNode, position) {
  if (vnode === prevVNode) return prevVNode;
  prevVNode = prevVNode ?? h();
  // If vnode is a string/number/boolean/null,
  // convert it into a vnode
  vnode = ensureVNode(vnode);
  applyFlags(vnode);

  // Component
  if (isComponent(vnode)) {
    return renderComponent(vnode, domElement, prevVNode, position);
  }

  // DOM elements

  // Create DOM node
  vnode.dom = addToDOM(vnode, domElement, prevVNode, position);

  // Diff props
  diffProps(vnode, prevVNode);

  // Render children
  vnode.childVNodes = renderChildren(vnode, prevVNode);

  return Object.assign(prevVNode, vnode);
}

export { render };
