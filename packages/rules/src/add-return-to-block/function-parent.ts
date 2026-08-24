import { U } from '@ts-unify/core'

/**
 * A function of any of the three syntaxes: a declaration, an expression,
 * an arrow.
 */
export const functionParent = U.or(
  U.FunctionDeclaration(),
  U.FunctionExpression(),
  U.ArrowFunctionExpression(),
)
