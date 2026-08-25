import type { TSESTree } from '@typescript-eslint/types'

/**
 * Each `AST_NODE_TYPES` member mapped to the parser's node interface of
 * that `type`.
 */
export type UpstreamByKind = {
  [K in keyof typeof TSESTree.AST_NODE_TYPES]: Extract<
    TSESTree.Node,
    { type: (typeof TSESTree.AST_NODE_TYPES)[K] }
  >
}
