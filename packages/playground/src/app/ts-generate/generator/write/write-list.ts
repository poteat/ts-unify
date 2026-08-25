import type {
  GeneratorNode,
  GeneratorTable,
} from '@ts-unify/playground/app/ts-generate/types'
import type { State } from 'astring'

import Separated from './separated'

/**
 * Write nodes as a comma-separated list: parameters, type arguments, the
 * elements of a tuple type.
 *
 * @param table the generator doing the writing
 * @param state astring's output state
 * @param nodes the nodes
 */
export const writeList = (
  table: GeneratorTable,
  state: State,
  nodes: readonly GeneratorNode[],
) => Separated.writeSeparated({ table, state, nodes, separator: ', ' })
