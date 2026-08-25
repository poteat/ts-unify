/**
 * Expression kinds an arrow body wraps in parentheses: an object literal
 * would read as a block, a sequence would end the arrow at its first comma.
 */
export const PARENTHESIZED_BODY: ReadonlySet<string> = new Set([
  'ObjectExpression',
  'SequenceExpression',
])
