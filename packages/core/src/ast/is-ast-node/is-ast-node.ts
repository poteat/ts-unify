import type { TSESTree } from '@typescript-eslint/types'

/**
 * Whether `T` is a concrete AST node.
 *
 * Branch on `IsAstNode<T> extends true` where the true branch returns `T`:
 * `T extends TSESTree.Node ? T : …` narrows `T` to `T & TSESTree.Node` there,
 * which a still-generic pattern's constraint cannot afford (see the spec).
 */
export type IsAstNode<T> = T extends TSESTree.Node ? true : false
