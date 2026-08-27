import type { AstNode } from '@bench/nodes/types'
/**
 * The `type` of a walked node, the key its group is filed under.
 *
 * @param node the node
 * @returns its `type`
 */
export const kindOf = (node: object) => (node as AstNode).type
