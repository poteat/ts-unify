/**
 * TS expression kinds recast prints without the parentheses their position
 * needs.
 *
 * As a member's object or a call's callee, `as`, `satisfies` and `<T>`
 * expressions are marked parenthesized.
 */
export const NEEDS_PARENS_AS_OPERAND: ReadonlySet<string> = new Set([
  'TSAsExpression',
  'TSSatisfiesExpression',
  'TSTypeAssertion',
])
