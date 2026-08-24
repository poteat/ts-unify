import type { TSESTree } from '@typescript-eslint/types'

/**
 * Where a report lands: on the matched node, or at a comment's location,
 * since a comment is not a node ESLint can be handed.
 */
export type ReportSite =
  | { node: TSESTree.Node }
  | { loc: TSESTree.SourceLocation }
