import { U, $ } from '@ts-unify/core'

/**
 * A call of the guarded callee as a statement, in a block of its own or
 * bare.
 */
export const callConsequent = U.maybeBlock(
  U.ExpressionStatement({
    expression: U.CallExpression({
      callee: $('callee'),
      arguments: $('args'),
    }),
  }),
)
