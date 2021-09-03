//@ts-check
/**
 * @typedef VNode
 * @type {import("./createElement").VNode}
 */

import { render } from "./render.js";

/**
 * The current component being rendered
 * @type {VNode}
 */
let currentComponent = null;
/**
 * Index of current hook
 * @type {number}
 */
let hookIndex = 0;

/**
 * Render a component
 * @param {VNode} vnode virtual node to render
 * @param {HTMLElement|Text} domElement DOM element to attach the node
 * @param {VNode} prevVNode previous virtual node
 * @param {number} [position] position of node in the parent
 */
function renderComponent(vnode, domElement, prevVNode, position) {
  // If there are no hooks, initialize an array
  prevVNode.hooks = vnode.hooks = prevVNode.hooks ?? [];

  // Store current component, so hooks can read data from component
  currentComponent = prevVNode;
  //
  // Note: why currentComponent is set as prevVNode?
  //
  // * This function always return the reference to prevVNode, see return statement
  //    at the end of this function.
  // * This is to ensure that the reference to a vnode stays the same.
  // * The values are updated by merging the new node to prevVNode, see
  //    return statement at the end of this function.

  // Reset hookIndex
  hookIndex = 0;

  // Prepare props for the component
  const props = { children: vnode.children, ...vnode.props };

  // Call the component function with props to get the node tree
  const rootVNode = /**@type {import("./createElement").Component<any>} */ (
    vnode.type
  )(props);

  vnode.rootVNode = render(
    rootVNode,
    domElement,
    prevVNode.rootVNode,
    position
  );

  // Assign parent DOM to vnode
  vnode.dom = domElement;

  return Object.assign(prevVNode, vnode);
}

/**
 * get current hook and the component
 * @returns{[any,VNode]}
 */
function getHook() {
  // hookIndex is incremented after each access
  const index = hookIndex++;
  // when another component starts rendering hookIndex will be reset to 0
  // see L#36

  if (currentComponent.hooks.length <= index) {
    // This hook does not exist, so create a new Object
    currentComponent.hooks[index] = {};
  }

  return [currentComponent.hooks[index], currentComponent];
}

export { renderComponent, getHook };
