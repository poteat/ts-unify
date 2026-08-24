import { U, $ } from '@ts-unify/core'

/**
 * A block of one `return`, its argument `undefined` when it has none;
 * sealed, so the argument takes the name of its position.
 */
export const returnBlock = U.BlockStatement({
  body: [U.ReturnStatement({ argument: $ }).defaultUndefined()],
}).seal()
