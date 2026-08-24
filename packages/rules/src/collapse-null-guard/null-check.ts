import { U, $ } from '@ts-unify/core'

import { returnFallback } from './return-fallback'

/**
 * An `if` with no `else` that compares a value to `null` with `===` and
 * returns the fallback, in a block or bare.
 */
export const nullCheck = U.IfStatement({
  test: U.BinaryExpression({
    operator: '===',
    left: $('value'),
    right: U.Literal({ value: null }),
  }),
  consequent: U.or(
    U.BlockStatement({
      body: [returnFallback],
    }),
    returnFallback,
  ).truthy(),
  alternate: null,
})
