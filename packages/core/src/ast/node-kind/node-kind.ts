import type { TSESTree } from '@typescript-eslint/types'

/**
 * AST node discriminant (aka "kind"): the `TSESTree.AST_NODE_TYPES` keys plus
 * `"Comment"`, the node view of a comment.
 *
 * - Used to index `NodeByKind` and to key builder maps.
 */
export type NodeKind = keyof typeof TSESTree.AST_NODE_TYPES | 'Comment'
