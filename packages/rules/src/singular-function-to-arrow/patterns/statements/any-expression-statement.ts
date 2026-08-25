import { U, $ } from '@ts-unify/core'

/**
 * An expression statement whose expression is captured.
 */
export const anyExpressionStatement = U.ExpressionStatement({ expression: $ })
