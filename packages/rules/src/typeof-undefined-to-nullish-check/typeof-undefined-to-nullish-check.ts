import { U, $ } from '@ts-unify/core'

/**
 * A `typeof` compared to `"undefined"` is a loose comparison of the value
 * to `null`.
 *
 * @example `typeof x === "undefined"` becomes `x == null`
 */
export const typeofUndefinedToNullishCheck = U.BinaryExpression({
  operator: U.or('===', '=='),
  left: U.UnaryExpression({
    operator: 'typeof',
    argument: $('expr'),
  }),
  right: U.Literal({ value: 'undefined' }),
})
  .to(it =>
    U.BinaryExpression({
      operator: '==',
      left: it.expr,
      right: U.Literal({ value: null }),
    }),
  )
  .message("Use == null instead of typeof === 'undefined'")
  .recommended()
