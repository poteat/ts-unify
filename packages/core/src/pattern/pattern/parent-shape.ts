import type { TSESTree } from '@typescript-eslint/types'

import type { NodeByKind } from '@/ast/node-by-kind'
import type { NodeKind } from '@/ast/node-kind'

/**
 * The nodes a `parent` constraint ranges over: every kind but `Comment`,
 * with `Program` in its upstream shape (its comments raw).
 *
 * A comment is never a parent, and the upstream `Program` keeps the union
 * within what the compiler can represent.
 */
export type ParentShape =
  | NodeByKind[Exclude<NodeKind, 'Comment' | 'Program'>]
  | TSESTree.Program
