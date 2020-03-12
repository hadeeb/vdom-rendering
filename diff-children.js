/**
 * @typedef VNode
 * @type {import("./createElement").VNode}
 */

import { render } from "./render.js";
import { ensureVNode, unmount } from "./utils.js";

/**
 * Loop through child nodes of a node and render them
 * @param {VNode} vnode
 * @param {VNode} prevVNode
 */
function renderChildren(vnode, prevVNode) {
  const prevChildNodes = prevVNode.childVNodes || [];

  /**
   * child nodes of the node
   * @type {VNode[]}
   */
  // children may contain arrays, so it is flattened
  // TODO: add an example
  const children = vnode.children.flat();

  vnode.childVNodes = children.map((child, index) => {
    child = ensureVNode(child);
    // Find previous node corresponding to this child node
    const prevChildVNode = prevChildNodes.find((node, i) => {
      if (node) {
        if (node.type === child.type && child.key === node.key) {
          if (i === index) {
            // No change in position => Don't pass position
            index = null;
          }
          // remove prevVNode so it won't match with any other vnode
          // also all elements remaining in this array will be removed from DOM
          prevChildNodes[i] = null;
          return true;
        }
      }
      return false;
    });

    return render(child, vnode.dom, prevChildVNode, index);
  });

  prevChildNodes.forEach(node => {
    // All reused vnodes are removed from this array, remove the rest from DOM
    if (node) {
      unmount(node);
    }
  });
}

export { renderChildren };
