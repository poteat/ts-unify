import type Types from './types'

/**
 * Whether a value is an object with a string `type`: a node, as the walker
 * tells one from a location, a token or a primitive.
 *
 * @param value anything reached in the tree
 * @returns true when the value is an object with a string `type`
 */
export const isAstNode = (value: unknown): value is Types.AstNode =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as Types.WithType).type === 'string'
