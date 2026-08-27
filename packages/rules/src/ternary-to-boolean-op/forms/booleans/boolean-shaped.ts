import type Types from '@ts-unify/rules/ternary-to-boolean-op/forms/types'

/**
 * Whether an expression is boolean by shape: a comparison, a negation, a
 * logical of such, or a boolean literal.
 *
 * For any other test the ternary's value may differ from the operator's
 * (`x ? true : r` is `true` where `x || r` is `x`), so only a
 * boolean-shaped test is rewritten.
 *
 * @param e the expression
 * @returns true when the expression is a comparison, a `!`, a logical of such,
 *          or a boolean literal
 */
export function booleanShaped(e: unknown): boolean {
  if (e === null || typeof e !== 'object') return false

  const n = e as Types.Test

  const isBinary = n.type === 'BinaryExpression'
  const isUnary = n.type === 'UnaryExpression'
  const isLogical = n.type === 'LogicalExpression'

  return isBinary
    ? [
        '===',
        '!==',
        '==',
        '!=',
        '<',
        '<=',
        '>',
        '>=',
        'in',
        'instanceof',
      ].includes(n.operator ?? '')
    : isUnary
      ? n.operator === '!'
      : isLogical
        ? (n.operator === '&&' || n.operator === '||') &&
          booleanShaped(n.left) &&
          booleanShaped(n.right)
        : n.type === 'Literal' && typeof n.value === 'boolean'
}
