import type { State } from 'astring'

import type { GeneratorNode } from '../generator-node'
import type { GeneratorTable } from '../generator-table'
import { writeNode } from './write-node'

/**
 * Write the type a wrapper node holds under `typeAnnotation`: the type
 * after a `TSTypeAnnotation`'s colon, inside parentheses, after `as`.
 *
 * @param table the generator doing the writing
 * @param node the wrapper node
 * @param state astring's output state
 */
export const writeWrappedType = (
  table: GeneratorTable,
  node: GeneratorNode,
  state: State,
) => writeNode(table, node.typeAnnotation, state)
