import type { State } from 'astring'

import type { GeneratorNode } from './generator-node'
import type { GeneratorTable } from './generator-table'

/**
 * Write a node's type annotation after it, when it carries one.
 *
 * @param table the generator doing the writing
 * @param node the node that may carry `typeAnnotation`
 * @param state astring's output state
 */
export function writeTypeAnnotation(
  table: GeneratorTable,
  node: GeneratorNode,
  state: State,
) {
  if (node.typeAnnotation) table.TSTypeAnnotation(node.typeAnnotation, state)
}
