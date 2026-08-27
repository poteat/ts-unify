import type { Node } from '@ts-unify/rules/inline-single-use-const/reads/tree'

/**
 * Whether an identifier is one of a function's parameters.
 *
 * @param fn the function node
 * @param id the identifier
 * @returns true when the identifier is in the function's `params`
 */
export const isParam = (fn: Node, id: Node) =>
  Array.isArray(fn.params) && fn.params.includes(id)
