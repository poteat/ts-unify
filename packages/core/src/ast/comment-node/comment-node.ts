import type { TSESTree } from '@typescript-eslint/types'

/**
 * `line` for `//`, `block` for `/* *\/`, `jsdoc` for `/** *\/`.
 */
export type CommentKind = 'line' | 'block' | 'jsdoc'

/**
 * One `@tag` of a JSDoc block: the tag name and the text after it.
 */
export type JsdocTag = {
  name: string

  /**
   * Text after the tag name, continuation lines joined by `\n`.
   */
  text: string
}

/**
 * A comment seen as a node, so `U.Comment({ ... })` can match it.
 *
 * - `text`: the comment with its delimiters removed; for `jsdoc`, with the
 *   leading `*` of every line removed too.
 * - `lines`: the comment's source text, delimiters included, split at line
 *   breaks.
 * - `summary`, `body`, `tags`: the parts of a `jsdoc` text; empty otherwise.
 * - `attachedTo`: the declaration the comment documents, or `null`.
 * - `header`: true when nothing but whitespace precedes the comment.
 */
export type CommentNode = {
  type: 'Comment'
  kind: CommentKind
  text: string
  lines: string[]
  summary: string[]
  body: string[]
  tags: JsdocTag[]
  attachedTo: TSESTree.Node | null
  header: boolean
  loc: TSESTree.SourceLocation
  range: TSESTree.Range
  parent: TSESTree.Program
}
