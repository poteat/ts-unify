import { U, $ } from '@ts-unify/core'

/**
 * A return of the guarded value, bare or under an `as`.
 */
export const returnOfValue = U.ReturnStatement({
  argument: U.or(
    $('value'),
    U.TSAsExpression({
      expression: $('value'),
      typeAnnotation: $,
    }),
  ),
})
