import type { CommentNode } from '@ts-unify/core/internal'

import Views from './views'
/**
 * The `Comment` node built from one raw parser comment, or undefined
 * when the program has no node for it.
 *
 * @param program the `Program` node the comment is under
 * @param raw the parser's comment
 */
export const commentNodeOf = (
  program: unknown,
  raw: unknown,
): CommentNode | undefined =>
  !raw || typeof raw !== 'object'
    ? undefined
    : Views.commentViews.of(program).byRaw.get(raw)
