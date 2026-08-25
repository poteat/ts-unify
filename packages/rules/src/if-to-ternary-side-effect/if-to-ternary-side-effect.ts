import { U, $ } from '@ts-unify/core'

import Patterns from './patterns'

/**
 * An `if` whose two branches are each one expression statement is one
 * statement of a ternary.
 *
 * @example `if (c) f(); else g()` becomes `c ? f() : g()`
 */
export const ifToTernarySideEffect = U.IfStatement({
  test: $,
  consequent: Patterns.anyExprForm,
  alternate: Patterns.anyExprForm,
})
  .to(bag =>
    U.ExpressionStatement({
      expression: U.ConditionalExpression(bag),
    }),
  )
  .message('Collapse if/else side-effect into ternary expression')
  .recommended()
