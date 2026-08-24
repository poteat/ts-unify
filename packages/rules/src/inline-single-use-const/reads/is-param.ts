import type { Node } from './tree'

/**
 * Whether an identifier is one of a function's parameters.
 *
 * @param fn the function node
 * @param id the identifier
 */
export const isParam = (fn: Node, id: Node) =>
  Array.isArray(fn.params) && fn.params.includes(id)
