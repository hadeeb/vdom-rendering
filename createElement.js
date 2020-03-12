/**
 * Virtual node
 * @typedef VNode
 * @type {object}
 * @property {string|function} type Type of node. It could be a string, function or TEXT_NODE
 * @property {any} props Properties of the node
 * @property {string|number|symbol|undefined} key
 * @property {VNode[]} children Children
 * @property {any[]} hooks Component hooks
 * @property {HTMLElement|null} dom DOM element to which VNode is attached
 * @property {VNode[]} childVNodes VNodes of children
 */

/**
 * This variable is used as `type` of virtual nodes created for text content
 */
const TEXT_NODE = Symbol("TextNode");
/**
 * Virtual node created from text contents
 * @typedef TextVNode
 * @type {object}
 * @property {typeof TEXT_NODE} type
 * @property {string|number} props
 * @property {Text|null} dom
 */

/**
 * `createElement` function to create virtual nodes.
 * @example
 * import { h } from "..."
 *
 * <button name="button">Press me</div>
 * //will get converted to
 * h({name:"button"},"Press me")
 * @param {string|function} type
 * @param {object} [props]
 * @param {(VNode|string|number|null)[]} children
 * @returns {VNode}
 */
function h(type, props, ...children) {
  return {
    type,
    props: props != null ? props : {},
    key: props != null ? props.key : null,
    children,
    hooks: [],
    childVNodes: [],
    dom: null
  };
}

export { h, TEXT_NODE };
