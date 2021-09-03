//@ts-check
/**
 * @typedef VNode
 * @type {import("./createElement").VNode}
 */

import { render } from "./render.js";
import { ensureVNode, unmount } from "./utils.js";

/**
 * Loop through child nodes of a node and render them
 * @param {VNode} vnode
 * @param {VNode} prevVNode previous virtual node
 */
function renderChildren(vnode, prevVNode) {
  const domElement = vnode.dom;
  const prevChildNodes = prevVNode.childVNodes ?? [];

  // children may contain arrays, so flatten it.
  // TODO: add an example
  const children = /**@type {VNode[]} */ (vnode.children).flat(Infinity);

  const childVNodes = children.map((child, index) => {
    child = ensureVNode(child);

    let childIndex = index;
    // Find previous node corresponding to this child node
    // TODO: add more info about keyed updates
    const prevChildVNode = prevChildNodes.find((node, i) => {
      if (node) {
        if (node.type === child.type && child.key === node.key) {
          if (i === index) {
            // No change in position here
            // So, don't pass position.
            // This helps to avoid a DOM operation, see dom.js L#27
            childIndex = null;
          }
          // remove prevVNode so it won't match with any other vnode
          // also all elements remaining in this array will be removed from DOM
          prevChildNodes[i] = null;
          return true;
        }
      }
      return false;
    });

    return render(child, domElement, prevChildVNode, childIndex);
  });

  prevChildNodes.forEach((node) => {
    // All reused vnodes are removed from this array, remove the rest from DOM
    if (node) {
      unmount(node);
    }
  });

  return childVNodes;
}

export { renderChildren };
