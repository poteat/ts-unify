import { U, $ } from '@ts-unify/core'

import Returns from './returns'

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
      body: [Returns.returnFallback],
    }),
    Returns.returnFallback,
  ).truthy(),
  alternate: null,
})
