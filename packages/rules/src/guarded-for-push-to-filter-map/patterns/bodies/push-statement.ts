import { U, $ } from '@ts-unify/core'

/**
 * The statement `arrayId.push(pushValue)`, in a block of its own or bare.
 */
export const pushStatement = U.maybeBlock(
  U.ExpressionStatement({
    expression: U.CallExpression({
      callee: U.MemberExpression({
        object: $('arrayId'),
        property: U.Identifier({ name: 'push' }),
      }),
      arguments: [$('pushValue')],
    }),
  }),
)
