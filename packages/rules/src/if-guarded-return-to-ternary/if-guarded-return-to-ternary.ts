import { U, $ } from '@ts-unify/core'

import Patterns from './patterns'

/**
 * An `if` with no `else` that returns, followed by a return, is one return
 * of a ternary.
 *
 * @example `if (c) return a; return b` becomes `return c ? a : b`
 */
export const ifGuardedReturnToTernary = U.BlockStatement({
  body: [
    ...$,
    U.IfStatement({
      test: $,
      consequent: Patterns.anyReturnForm,
      alternate: null,
    }),
    U.ReturnStatement({ argument: $('alternate') }).defaultUndefined(),
  ],
})
  .to(({ body, ...bag }) =>
    U.BlockStatement({
      body: [
        ...body,
        U.ReturnStatement({
          argument: U.ConditionalExpression(bag),
        }),
      ],
    }),
  )
  .message('Collapse if-guarded return into ternary')
  .recommended()
