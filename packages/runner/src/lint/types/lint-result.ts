import type { LintMatch } from './matches'

/**
 * A lint run over one source: the matches, the tree they came from, and
 * the parse error when there was one.
 */
export type LintResult = {
  matches: LintMatch[]
  ast: unknown
  error: string | null
}
