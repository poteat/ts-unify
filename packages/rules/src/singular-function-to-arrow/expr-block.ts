import { U, $ } from '@ts-unify/core'

/**
 * A block of one expression statement, captured whole as the body.
 */
export const exprBlock = U.BlockStatement({
  body: [U.ExpressionStatement({ expression: $ })],
}).bind()
