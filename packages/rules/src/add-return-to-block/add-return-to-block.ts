import { U, $ } from '@ts-unify/core'

import { functionParent } from './function-parent'

/**
 * A function body that is one expression statement returns that
 * expression.
 *
 * @example `() => { f() }` becomes `() => { return f() }`
 */
export const addReturnToBlock = U.BlockStatement({
  parent: functionParent,
  body: [
    U.ExpressionStatement({ expression: $ }).to(it =>
      U.ReturnStatement({ argument: it.expression }),
    ),
  ],
}).message('Add explicit return to single-expression function body')
