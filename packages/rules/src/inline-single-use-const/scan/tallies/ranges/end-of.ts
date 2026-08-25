import type { Node } from '@ts-unify/rules/inline-single-use-const/reads/tree'

/**
 * Where a node's source range ends; Infinity for a node without one.
 *
 * @param node the node
 */
export const endOf = (node: Node) =>
  Array.isArray(node.range) ? (node.range[1] as number) : Infinity
