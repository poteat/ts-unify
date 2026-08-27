import type {
  GeneratorNode,
  GeneratorTable,
} from '@ts-unify/playground/app/ts-generate/types'
import type { State } from 'astring'

/**
 * Write a node through the table's method for its `type`.
 *
 * @param table the generator doing the writing
 * @param state astring's output state
 * @param node the node
 */
export const writeNode = (
  table: GeneratorTable,
  state: State,
  node: GeneratorNode,
) => table[node.type](node, state)
