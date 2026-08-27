import type { MaybeTyped } from './types'
/**
 * The `type` of a value that may be an AST node; undefined for anything
 * else.
 *
 * @param v the value
 * @returns its `type` property, or undefined for a non-object or one without it
 */
export const nodeType = (v: unknown) =>
  (v as MaybeTyped | null | undefined)?.type
