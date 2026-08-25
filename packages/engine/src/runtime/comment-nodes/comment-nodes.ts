import type { CommentNode } from '@ts-unify/core/internal'

import Views from './views'
/**
 * The comments of a parsed program as `Comment` nodes, in source order;
 * see `CommentNode` for the shape and the attachment rule.
 *
 * @param program a `Program` node with `comments` (and, for attachment,
 * `tokens`) as produced by a parser with `comment: true, tokens: true`
 */
export const commentNodes = (program: unknown): CommentNode[] =>
  Views.commentViews.of(program).list
