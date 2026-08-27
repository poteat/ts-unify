import { U } from '@ts-unify/core'
import type { TSESTree } from '@typescript-eslint/types'

/**
 * A skip's test as the filter's: `!c`, or `p` when the skip was `!p`.
 *
 * @param skipped the `continue`'s test, as captured from the loop
 * @returns the expression the filter keeps by
 */
export function negated(skipped: TSESTree.Expression) {
  const isNegation =
    skipped.type === 'UnaryExpression' && skipped.operator === '!'

  return isNegation
    ? skipped.argument
    : U.UnaryExpression({ operator: '!', prefix: true, argument: skipped })
}
