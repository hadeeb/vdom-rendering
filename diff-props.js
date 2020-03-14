/**
 * @typedef VNode
 * @type {import("./createElement").VNode}
 */

import { eventProxy, isTextNode } from "./utils.js";

/**
 * Find the differences of 2 virtual nodes and apply the changes to the DOM
 * @param {VNode} vnode current virtual node
 * @param {VNode} prevVNode previous virtual node
 */
function diffProps(vnode, prevVNode) {
  const domElement = vnode.dom;

  // When a node is rendering for the first time,
  // prevVNode will be an empty object({}). (See render.js L#19)
  // In those cases, prevVNode.props will be undefined, so use an empty object
  const prevProps = prevVNode.props ?? {};
  const newProps = vnode.props;

  if (newProps !== prevProps) {
    if (isTextNode(vnode)) {
      // For text nodes props contains the text content
      // see utils.js L#17
      // For text nodes, domElement will be an instance of `Text`
      // see render.js L#46
      domElement.data = newProps;
    } else {
      // Iterate through props
      Object.keys(newProps).forEach(key => {
        const newPropValue = newProps[key];
        const prevPropValue = prevProps[key];

        if (newPropValue !== prevPropValue) {
          if (key.startsWith("on")) {
            // Events
            // Converting key to lowercase to support both
            // `onclick` and `onClick`
            const event = key.toLowerCase().slice(2);
            if (newPropValue) {
              // An object is attached to the DOM element and
              // event listeners are stored there.
              if (!domElement.vnodeListeners) {
                domElement.vnodeListeners = {};
              }
              domElement.vnodeListeners[event] = newPropValue;

              if (!prevPropValue) {
                // Using a common event handler to avoid repeatedly removing
                // and adding event listeners
                // eventProxy will invoke the currect listener using the
                // value of `event.type`
                domElement.addEventListener(event, eventProxy);
              }
            } else {
              domElement.removeEventListener(event, eventProxy);
            }
          } else if (key in domElement) {
            // DOM properties
            domElement[key] = newPropValue;
          } else {
            // DOM attributes
            domElement.setAttribute(key, newPropValue);
          }
        }
      });
    }
  }
}

export { diffProps };
