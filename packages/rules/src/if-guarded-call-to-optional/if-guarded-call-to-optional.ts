import { U, $ } from '@ts-unify/core'

const callConsequent = U.maybeBlock(
  U.ExpressionStatement({
    expression: U.CallExpression({
      callee: $('callee'),
      arguments: $('args'),
    }),
  }),
)

/**
 * Transform if-guarded function calls into optional chaining: the test and
 * the call's callee are one capture, so only a call of the thing tested
 * matches, not any call under any guard.
 *
 * @example
 * ```ts
 * // Before
 * if (func) {
 *   func(arg1, arg2);
 * }
 *
 * // After
 * func?.(arg1, arg2);
 * ```
 */
export const ifGuardedCallToOptional = U.IfStatement({
  test: $('callee'),
  consequent: callConsequent,
  alternate: null,
})
  .to(({ callee, args }) =>
    U.ExpressionStatement({
      expression: U.ChainExpression({
        expression: U.CallExpression({
          callee,
          arguments: args,
          optional: true,
        }),
      }),
    }),
  )
  .message('Use optional call instead of if-guarded function call')
  .recommended()
