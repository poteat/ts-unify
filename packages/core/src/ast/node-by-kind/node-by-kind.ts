import type { TSESTree } from '@typescript-eslint/types'

import type { CommentNode } from '@/ast/comment-node'

type UpstreamByKind = {
  [K in keyof typeof TSESTree.AST_NODE_TYPES]: Extract<
    TSESTree.Node,
    { type: (typeof TSESTree.AST_NODE_TYPES)[K] }
  >
}

/**
 * Map node kind → concrete `TSESTree.Node` interface for that kind, plus
 * `Comment` → `CommentNode`. `Program.comments` holds `CommentNode`s, the
 * view a match presents for the parser's raw comments.
 *
 * - Uses the `type` discriminant to extract the specific interface.
 * - Keeps a precise association without copying upstream node definitions.
 */
export type NodeByKind = Omit<UpstreamByKind, 'Program'> & {
  Program: Omit<TSESTree.Program, 'comments'> & { comments?: CommentNode[] }
  Comment: CommentNode
}
