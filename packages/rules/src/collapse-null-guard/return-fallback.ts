import { U, $ } from '@ts-unify/core'

/**
 * A return of the guard's fallback.
 */
export const returnFallback = U.ReturnStatement({ argument: $('fallback') })
