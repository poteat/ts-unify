/**
 * The `type` of a value that may be an AST node; undefined for anything
 * else.
 *
 * @param v the value
 */
export const nodeType = (v: unknown) =>
  (v as { type?: unknown } | null | undefined)?.type
