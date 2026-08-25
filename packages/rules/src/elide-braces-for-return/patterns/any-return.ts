import { U, $ } from '@ts-unify/core'

/**
 * A `return` whose argument is captured, `undefined` when it has none.
 */
export const anyReturn = U.ReturnStatement({ argument: $ }).defaultUndefined()
