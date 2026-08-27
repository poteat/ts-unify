import type {
  GeneratorNode,
  GeneratorTable,
} from '@ts-unify/playground/app/ts-generate/types'
import type { State } from 'astring'

import Node from './node'

/**
 * Write the type a wrapper node holds under `typeAnnotation`: the type
 * after a `TSTypeAnnotation`'s colon, inside parentheses, after `as`.
 *
 * @param table the generator doing the writing
 * @param state astring's output state
 * @param node the wrapper node
 */
export const writeWrappedType = (
  table: GeneratorTable,
  state: State,
  node: GeneratorNode,
) => Node.writeNode(table, state, node.typeAnnotation)
