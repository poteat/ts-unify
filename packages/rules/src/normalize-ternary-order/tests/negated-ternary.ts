import { U, $ } from '@ts-unify/core'

/**
 * A ternary whose test is a `!` over the condition.
 */
export const negatedTernary = U.ConditionalExpression({
  test: U.UnaryExpression({ operator: '!', argument: $('condition') }),
  ...$,
})
