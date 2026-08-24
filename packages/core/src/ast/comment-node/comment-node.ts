import type { TSESTree } from '@typescript-eslint/types'

import type { CommentKind } from './comment-kind'
import type { JsdocTag } from './jsdoc-tag'

/**
 * A comment seen as a node, so `U.Comment({ ... })` can match it.
 */
export type CommentNode = {
  type: 'Comment'
  kind: CommentKind

  /**
   * The comment with its delimiters removed; for `jsdoc`, with the
   * leading `*` of every line removed too.
   */
  text: string

  /**
   * The comment's source text, delimiters included, split at line breaks.
   */
  lines: string[]

  /**
   * The first paragraph of a `jsdoc` text; empty for the other kinds.
   */
  summary: string[]

  /**
   * The paragraphs of a `jsdoc` text between its first one and its tags;
   * empty for the other kinds.
   */
  body: string[]

  /**
   * The `@tag` entries of a `jsdoc` text; empty for the other kinds.
   */
  tags: JsdocTag[]

  /**
   * The declaration the comment documents, or `null`.
   */
  attachedTo: TSESTree.Node | null

  /**
   * `true` when nothing but whitespace precedes the comment.
   */
  header: boolean

  loc: TSESTree.SourceLocation
  range: TSESTree.Range
  parent: TSESTree.Program
}
