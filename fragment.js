/**
 * @typedef VNode
 * @type {import("./createElement").VNode}
 */

import { renderChildren } from "./diff-children.js";

/**
 *
 * @param {{children:VNode[]}} props
 */
function Fragment(props) {
  return props.children;
}

/**
 * Render a Fragment node
 * @param {VNode} vnode virtual node to render
 * @param {HTMLElement} domElement DOM element to attach the node
 * @param {VNode} prevVNode previous virtual node
 * @param {number} position position of node in the parent
 * @returns {VNode}
 */
function renderFragment(vnode, domElement, prevVNode, position) {
  vnode.childVNodes = renderChildren(
    vnode.children,
    domElement,
    prevVNode.childVNodes,
    position
  );
  return Object.assign(prevVNode, vnode);
}

/**
 *
 * @param {VNode} vnode
 */
function isFragment(vnode) {
  return vnode.type === Fragment;
}

export { Fragment, renderFragment, isFragment };
