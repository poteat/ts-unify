import type { AstNode } from '@bench/nodes/types'

import type { MaybeTyped } from './types'
/**
 * Whether a value is an AST node: an object with a string `type`.
 *
 * @param value the value
 * @returns true when the value is an object with a string `type`
 */
export const isNode = (value: unknown): value is AstNode =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as MaybeTyped).type === 'string'
