import { U } from '@ts-unify/core'
import type { TSESTree } from '@typescript-eslint/types'

/**
 * The arrow `param => body`.
 *
 * @param param the one parameter
 * @param body the expression returned, as captured from the loop
 * @returns an `ArrowFunctionExpression` with the one param and the body
 */
export const arrowFrom = (
  param: TSESTree.BindingName,
  body: TSESTree.Expression | TSESTree.SpreadElement,
) => U.ArrowFunctionExpression({ params: [param], body })
