import { $, U } from '@ts-unify/core/internal'

/**
 * A pattern for a block of one expression statement, whose expression is
 * captured.
 */
export const expressionBlock = () =>
  U.BlockStatement({ body: [U.ExpressionStatement({ expression: $ })] })
