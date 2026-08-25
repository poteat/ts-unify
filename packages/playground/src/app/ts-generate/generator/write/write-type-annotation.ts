import type {
  GeneratorNode,
  GeneratorTable,
} from '@ts-unify/playground/app/ts-generate/types'
import type { State } from 'astring'

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
