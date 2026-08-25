import type {
  GeneratorNode,
  GeneratorTable,
} from '@ts-unify/playground/app/ts-generate/types'
import type { State } from 'astring'

/**
 * Write a node through the table's method for its `type`.
 *
 * @param table the generator doing the writing
 * @param node the node
 * @param state astring's output state
 */
export const writeNode = (
  table: GeneratorTable,
  node: GeneratorNode,
  state: State,
) => table[node.type](node, state)
