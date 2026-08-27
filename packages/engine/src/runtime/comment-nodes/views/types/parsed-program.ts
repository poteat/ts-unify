import type { TSESTree } from '@typescript-eslint/types'

import type { RangedToken } from './tokens'

/**
 * A `Program` node as a parser run with `comment: true, tokens: true`
 * gives it: the comments, and the tokens attachment reads.
 */
export type ParsedProgram = {
  type: 'Program'
  comments?: TSESTree.Comment[]
  tokens?: RangedToken[]
}
