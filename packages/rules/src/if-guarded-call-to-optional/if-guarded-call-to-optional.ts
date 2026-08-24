import { U, $ } from '@ts-unify/core'

import { callConsequent } from './call-consequent'

/**
 * An `if` that tests a value and only calls it is an optional call. The
 * test and the callee are one capture, so a call of another thing stays.
 *
 * @example `if (f) { f(a) }` becomes `f?.(a)`
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
