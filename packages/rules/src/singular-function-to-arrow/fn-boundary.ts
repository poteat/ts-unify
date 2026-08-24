import { U } from '@ts-unify/core'

/**
 * A function of either non-arrow syntax, where a search for `this` or
 * `arguments` stops: an inner function has its own.
 */
export const fnBoundary = U.or(U.FunctionDeclaration(), U.FunctionExpression())
