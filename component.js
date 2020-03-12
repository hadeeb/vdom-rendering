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
 * @param {HTMLElement} domElement DOM element to attach the node
 * @param {VNode} prevVNode previous virtual node
 * @param {number} position position of node in the parent
 */
function renderComponent(vnode, domElement, prevVNode, position) {
  // Copy previous hooks
  if (prevVNode.hooks) {
    vnode.hooks = prevVNode.hooks;
  }

  // Store current component, so hooks can read data from component
  currentComponent = vnode;

  // Reset hookIndex
  hookIndex = 0;

  // Prepare props for the component
  const props = { children: vnode.children, ...vnode.props };

  // Call the component function with props to get the node tree
  const rootVNode = vnode.type(props);

  // A components `children` are handled by the component,
  // So, reusing `childVNodes` key to store VNode obtained by
  // rendering the component.
  vnode.childVNodes = render(
    rootVNode,
    domElement,
    prevVNode.childVNodes,
    position
  );

  // Save the dom
  vnode.dom = vnode.childVNodes.dom;

  return Object.assign(prevVNode, vnode);
}

/**
 * get current hook and the component
 * @returns{[any,VNode]}
 */
function getHook() {
  if (!currentComponent) {
    throw new Error("Hook called outside component");
  }

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
