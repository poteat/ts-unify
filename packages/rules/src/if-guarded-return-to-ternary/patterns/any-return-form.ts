import { U, $ } from '@ts-unify/core'

/**
 * A `return` in a block of its own or bare, its argument `undefined` when
 * it has none; sealed, so the argument takes the name of its position.
 */
export const anyReturnForm = U.maybeBlock(U.ReturnStatement({ argument: $ }))
  .defaultUndefined()
  .seal()
