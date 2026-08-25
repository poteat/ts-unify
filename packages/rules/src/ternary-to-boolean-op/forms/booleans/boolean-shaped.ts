/**
 * Whether an expression is boolean by shape: a comparison, a negation, a
 * logical of such, or a boolean literal.
 *
 * For any other test the ternary's value may differ from the operator's
 * (`x ? true : r` is `true` where `x || r` is `x`), so only a
 * boolean-shaped test is rewritten.
 *
 * @param e the expression
 */
export function booleanShaped(e: unknown): boolean {
  if (e === null || typeof e !== 'object') return false

  const n = e as {
    type: string
    operator?: string
    left?: unknown
    right?: unknown
    argument?: unknown
    value?: unknown
  }

  return n.type === 'BinaryExpression'
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
    : n.type === 'UnaryExpression'
      ? n.operator === '!'
      : n.type === 'LogicalExpression'
        ? (n.operator === '&&' || n.operator === '||') &&
          booleanShaped(n.left) &&
          booleanShaped(n.right)
        : n.type === 'Literal' && typeof n.value === 'boolean'
}
