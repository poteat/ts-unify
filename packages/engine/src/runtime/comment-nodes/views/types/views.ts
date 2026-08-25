import type { CommentNode } from '@ts-unify/core/internal'

/**
 * A program's comments seen two ways: in source order, and by the raw
 * parser comment each came from.
 */
export type Views = {
  list: CommentNode[]
  byRaw: WeakMap<object, CommentNode>
}
