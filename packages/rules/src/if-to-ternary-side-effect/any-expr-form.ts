import { U, $ } from '@ts-unify/core'

/**
 * An expression statement in a block of its own or bare; sealed, so the
 * expression takes the name of its position.
 */
export const anyExprForm = U.maybeBlock(
  U.ExpressionStatement({ expression: $ }),
).seal()
