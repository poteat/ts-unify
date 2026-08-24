import type { State } from 'astring'

import type { GeneratorNode } from '../generator-node'
import type { GeneratorTable } from '../generator-table'
import { writeSeparated } from './write-separated'

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
) => writeSeparated({ table, state, nodes, separator: ', ' })
