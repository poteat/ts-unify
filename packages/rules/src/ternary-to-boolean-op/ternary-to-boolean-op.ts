import { U, $ } from '@ts-unify/core'

import Forms from './forms'

/**
 * A ternary with a boolean literal arm is a boolean operator: `c ? true : r`
 * is `c || r`, `c ? r : false` is `c && r`, `c ? false : r` is `!c && r`.
 *
 * `c ? true : false` is `c`, and `c ? false : true` is `!c`, an equality
 * flipped. Only a test boolean by shape is rewritten: a comparison, a
 * negation, a logical of those.
 *
 * @example `x === 1 ? true : rest` becomes `x === 1 || rest`
 */
export const ternaryToBooleanOp = U.ConditionalExpression({
  test: $('test'),
  consequent: $('consequent'),
  alternate: $('alternate'),
})
  .when(bag => Forms.form(bag) !== null)
  .to(bag => Forms.form(bag))
  .message('A ternary with a boolean literal arm is a boolean operator')
