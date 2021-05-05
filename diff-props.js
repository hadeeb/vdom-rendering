//@ts-check
/**
 * @typedef VNode
 * @type {import("./createElement").VNode}
 */

import { eventProxy, isSVG, isTextNode } from "./utils.js";

/**
 * Find the differences of 2 virtual nodes and apply the changes to the DOM
 * @param {VNode} vnode current virtual node
 * @param {VNode} prevVNode previous virtual node
 */
function diffProps(vnode, prevVNode) {
  const prevProps = prevVNode.props;
  const newProps = vnode.props;

  if (newProps !== prevProps) {
    if (isTextNode(vnode)) {
      // For text nodes props contains the text content
      // see utils.js L#17
      // For text nodes, vnode.dom will be an instance of `Text`
      // see render.js L#46
      /**@type {Text} */ (vnode.dom).data = newProps;
    } else {
      // Cleanup old props
      Object.keys(prevProps).forEach((key) => {
        if (key !== "key" && key !== "ref" && !(key in newProps)) {
          setDOMProperty(vnode, key, null, prevProps[key]);
        }
      });
      // Iterate through new props
      Object.keys(newProps).forEach((key) => {
        setDOMProperty(vnode, key, newProps[key], prevProps[key]);
      });
    }
  }
}
/**
 * Sets an attribute / eventlistener / property on a dom element
 * @param {VNode} vnode
 * @param {string} key
 * @param {any} newPropValue
 * @param {any} prevPropValue
 */
function setDOMProperty(vnode, key, newPropValue, prevPropValue) {
  const domElement = /**@type {HTMLElement|SVGElement} */ (vnode.dom);
  if (newPropValue !== prevPropValue) {
    if (key === "key") {
      // Do nothing
    } else if (key === "ref") {
      // Assign dom element to the ref
      /**@type {import("./hooks.js").RefHook<HTMLElement|SVGElement>} */ (newPropValue).current = domElement;
    } else if (key.startsWith("on")) {
      // Events
      // An object is attached to the DOM element and
      // event listeners are stored there.
      // @ts-ignore
      if (!domElement.vnodeListeners) {
        // @ts-ignore
        domElement.vnodeListeners = {};
      }
      // Converting key to lowercase to support both
      // `onclick` and `onClick`
      const event = key.toLowerCase().slice(2);
      // @ts-ignore
      domElement.vnodeListeners[event] = newPropValue;
      if (newPropValue) {
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
    } else if (!isSVG(vnode) && key in domElement) {
      // DOM properties
      domElement[key] = newPropValue;
    } else {
      // DOM attributes
      if (newPropValue) {
        domElement.setAttribute(key, newPropValue);
      } else {
        domElement.removeAttribute(key);
      }
    }
  }
}

export { diffProps };
