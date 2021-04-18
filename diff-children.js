/**
 * @typedef VNode
 * @type {import("./createElement").VNode}
 */

import { render } from "./render.js";
import { ensureVNode, unmount } from "./utils.js";

/**
 * Loop through child nodes of a node and render them
 * @param {VNode[]} children child nodes
 * @param {HTMLElement} domElement DOM element to attach the child nodes
 * @param {VNode[]|null} prevChildNodes virtual nodes from previous render
 * @param {number} [position] position of the children in parent node
 */
function renderChildren(children, domElement, prevChildNodes, position) {
  prevChildNodes = prevChildNodes ?? [];
  // If there are any changes in position of the parent,
  // `position` parameter will be a number, see L#38
  const hasParentPositionChanged = position != null;

  // Use 0 as default value
  position = hasParentPositionChanged ? position : 0;

  // children may contain arrays, so flatten it.
  // TODO: add an example
  children = children.flat(Infinity);

  const childVNodes = children.map((child, index) => {
    child = ensureVNode(child);

    let childIndex = position + index;
    // Find previous node corresponding to this child node
    // TODO: add more info about keyed updates
    const prevChildVNode = prevChildNodes.find((node, i) => {
      if (node) {
        if (node.type === child.type && child.key === node.key) {
          if (i === index && !hasParentPositionChanged) {
            // No change in position here
            // and there is no change in position in parent, see L#17
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
