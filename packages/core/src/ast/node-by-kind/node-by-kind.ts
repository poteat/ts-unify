import type { TSESTree } from '@typescript-eslint/types'

import type { CommentNode } from '@/ast/comment-node'

import type { UpstreamByKind } from './types'

/**
 * Each node kind mapped to its concrete `TSESTree.Node` interface, plus
 * `Comment` to `CommentNode`.
 *
 * `Program.comments` holds `CommentNode`s, the view a match presents for
 * the parser's raw comments. The `type` discriminant picks each interface
 * out of `TSESTree.Node`, so no upstream definition is copied.
 */
export type NodeByKind = Omit<UpstreamByKind, 'Program'> & {
  Program: Omit<TSESTree.Program, 'comments'> & { comments?: CommentNode[] }
  Comment: CommentNode
}
