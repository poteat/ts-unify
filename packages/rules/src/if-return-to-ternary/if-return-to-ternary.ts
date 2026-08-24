import { U, $ } from '@ts-unify/core'

import { anyReturnForm } from './any-return-form'

/**
 * An `if` whose two branches each return is one return of a ternary.
 *
 * @example `if (c) return a; else return b` becomes `return c ? a : b`
 */
export const ifReturnToTernary = U.IfStatement({
  test: $,
  consequent: anyReturnForm,
  alternate: anyReturnForm,
})
  .to(bag => U.ReturnStatement({ argument: U.ConditionalExpression(bag) }))
  .message('Collapse if/else return into ternary')
  .recommended()
