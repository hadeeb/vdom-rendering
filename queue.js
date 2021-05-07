//@ts-check
/**
 * @typedef VNode
 * @type {import("./createElement").VNode}
 */

import { renderComponent } from "./component.js";
import { UPDATE_PENDING } from "./createElement.js";

const updateQueue = new Set(/**@type{VNode[]}*/ ([]));

/**
 * Add a vnode to the update queue
 * @param {VNode} vnode
 */
function enqueue(vnode) {
  updateQueue.add(vnode);
  vnode.flags = vnode.flags | UPDATE_PENDING;
  requestAnimationFrame(renderQueue);
}

/**
 * Mark a vnode as updated
 * @param {VNode} vnode
 */
function markAsUpdated(vnode) {
  vnode.flags = vnode.flags & ~UPDATE_PENDING;
}

function renderQueue() {
  if (!updateQueue.size) {
    return;
  }

  const currentQueue = [...updateQueue].sort((a, b) => a.depth - b.depth);

  updateQueue.clear();

  for (let currentComponent of currentQueue) {
    if (currentComponent.flags & UPDATE_PENDING) {
      renderComponent(currentComponent, currentComponent.dom, currentComponent);
    }
  }
}

export { enqueue, markAsUpdated };
