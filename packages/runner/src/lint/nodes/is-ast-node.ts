import type { AstNode } from './types'

/**
 * Whether a value is an object with a string `type`: a node, as the walker
 * tells one from a location, a token or a primitive.
 *
 * @param value anything reached in the tree
 */
export const isAstNode = (value: unknown): value is AstNode =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as { type?: unknown }).type === 'string'
