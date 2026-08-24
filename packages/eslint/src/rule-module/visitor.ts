import type { TSESTree } from '@typescript-eslint/types'

/**
 * What ESLint calls with each node of one type as it walks a file.
 */
export type Visitor = (node: TSESTree.Node) => void
