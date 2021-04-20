//@ts-check
/**
 * Virtual node
 * @typedef VNode
 * @type {object}
 *
 * @property {string|function} type Type of node.
 *
 *        It will be a string for DOM elements like `div`,`button`,etc.
 *
 *        For components, it will the component function.
 *
 *        For text nodes, it will be TEXT_NODE
 *
 * @property {any} props Properties of the node
 *
 *        eg: `id` of the `div` element, `initialCount` of the `Counter` component, etc.
 *
 * @property {string|number|symbol|undefined} key It is used to uniquely
 *        identify a node in an array of nodes.
 *
 *        TODO: Add link to keyed update
 *
 * @property {(VNode|string|number|null)[]} children Children of the node aka the content of the node.
 *
 *        eg: the text inside a `button`
 *
 * @property {HTMLElement|Text} [dom] DOM element to which VNode is attached
 *
 *        If the node is a text node, this will be a `Text` element
 *
 *        If the node is a component, it will be the parent DOM element
 *
 * @property {VNode[]} [childVNodes] Virtual nodes of the children of this node.
 *
 *         This is obtained by recursively rendering the `children` of the node.
 *
 * @property {VNode} [rootVNode] Virtual node returned from a component.
 *
 *         This is obtained by rendering the output of the component function.
 *
 * @property {any[]} [hooks] Component hooks
 *
 *        For component nodes, it's states & effects are stored here.
 */

/**
 * This variable is used as `type` of virtual nodes created for text content
 * @type {string}
 */
// @ts-ignore
const TEXT_NODE = Symbol("TextNode");
/**
 * Virtual node created from text contents
 * @typedef TextVNode
 * @type {object}
 * @property {typeof TEXT_NODE} type
 * @property {string|number} props
 * @property {Text|undefined} dom
 */

/**
 * `createElement` function to create virtual nodes.
 * @example
 * import { h } from "..."
 *
 * <button name="button">Press me</div>
 * //will get converted to
 * h("button", { name:"button" }, "Press me")
 * @param {string|function} [type]
 * @param {object} [props]
 * @param {(VNode|string|number|null)[]} children
 * @returns {VNode}
 */
function h(type, props, ...children) {
  props = props ?? {};
  return {
    type,
    props,
    key: props.key,
    children,
    childVNodes: null,
    rootVNode: null,
    dom: null,
    hooks: null,
  };
}

export { h, TEXT_NODE };
