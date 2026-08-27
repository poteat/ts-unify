import { U, $ } from '@ts-unify/core'

/**
 * The bare statement `arrayName.push(pushValue)`.
 */
export const pushStatement = U.ExpressionStatement({
  expression: U.CallExpression({
    callee: U.MemberExpression({
      object: U.Identifier({ name: $('arrayName') }),
      property: U.Identifier({ name: 'push' }),
    }),
    arguments: [$('pushValue')],
  }),
})
