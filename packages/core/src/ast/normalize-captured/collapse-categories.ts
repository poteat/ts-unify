import type { TSESTree } from '@typescript-eslint/types'

/**
 * Widens an expression node type to `TSESTree.Expression` and a statement
 * node type to `TSESTree.Statement`; any other type passes through.
 */
export type CollapseCategories<T> = [T] extends [TSESTree.Expression]
  ? TSESTree.Expression
  : [T] extends [TSESTree.Statement]
    ? TSESTree.Statement
    : T
