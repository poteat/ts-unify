import { U, $ } from '@ts-unify/core'
import IfGuardedReturnToTernary from '@ts-unify/rules/if-guarded-return-to-ternary'

/**
 * An `if` whose two branches each return is one return of a ternary.
 *
 * @example `if (c) return a; else return b` becomes `return c ? a : b`
 */
export const ifReturnToTernary = U.IfStatement({
  test: $,
  consequent: IfGuardedReturnToTernary.anyReturnForm,
  alternate: IfGuardedReturnToTernary.anyReturnForm,
})
  .to(bag => U.ReturnStatement({ argument: U.ConditionalExpression(bag) }))
  .message('Collapse if/else return into ternary')
  .recommended()
