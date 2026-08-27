import type { CommentNode } from '@ts-unify/core/internal'

import Views from './views'
/**
 * The `Comment` node built from one raw parser comment, or undefined
 * when the program has no node for it.
 *
 * @param program the `Program` node the comment is under
 * @param raw the parser's comment
 * @returns the view's `Comment` node for the raw comment, or undefined without
 *          one
 */
export function commentNodeOf(
  program: unknown,
  raw: unknown,
): CommentNode | undefined {
  const isObject = typeof raw === 'object' && raw !== null

  return isObject ? Views.commentViews.of(program).byRaw.get(raw) : undefined
}
