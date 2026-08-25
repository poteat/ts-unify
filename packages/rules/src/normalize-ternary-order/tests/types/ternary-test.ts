import type { TSESTree } from '@typescript-eslint/types'

/**
 * What a matched ternary captured from its test: the operand of a `!`,
 * or the parts of an inequality.
 */
export type TernaryTest =
  | { condition: TSESTree.Expression }
  | {
      operator: TSESTree.BinaryExpression['operator']
      left: TSESTree.BinaryExpression['left']
      right: TSESTree.Expression
    }
