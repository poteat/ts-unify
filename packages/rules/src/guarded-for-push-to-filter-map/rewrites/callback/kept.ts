import { U } from '@ts-unify/core'
import type { TSESTree } from '@typescript-eslint/types'

/**
 * The arrow `param => body`, or with the consts kept in a block before
 * the `return` when there are any.
 *
 * @param param the one parameter
 * @param consts the consts the loop bound before the push
 * @param body the expression returned, as captured from the loop
 * @returns an `ArrowFunctionExpression` with the one param and the body
 */
export function kept(
  param: TSESTree.BindingName,
  consts: ReadonlyArray<TSESTree.Statement> | undefined,
  body: TSESTree.Expression | TSESTree.SpreadElement,
) {
  const isBare = consts === undefined || consts.length === 0

  return isBare
    ? U.ArrowFunctionExpression({ params: [param], body })
    : U.ArrowFunctionExpression({
        params: [param],
        body: U.BlockStatement({
          body: [...consts, U.ReturnStatement({ argument: body })],
        }),
      })
}
