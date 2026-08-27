import type { TSESTree } from '@typescript-eslint/types'

import type Types from '@/ast/types'

/**
 * Each `AST_NODE_TYPES` member mapped to the parser's node interface of
 * that `type`.
 */
export type UpstreamByKind = {
  [K in keyof typeof TSESTree.AST_NODE_TYPES]: Extract<
    TSESTree.Node,
    Types.Typed<(typeof TSESTree.AST_NODE_TYPES)[K]>
  >
}
