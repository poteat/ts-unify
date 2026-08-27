import type { Arm } from './types'

/**
 * Whether a node is a literal.
 *
 * @param e the node
 * @returns true when the node's `type` is `Literal`
 */
export const isLiteral = (e: unknown): e is Arm =>
  typeof e === 'object' && e !== null && (e as Arm).type === 'Literal'
