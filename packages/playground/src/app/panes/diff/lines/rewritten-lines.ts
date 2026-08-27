import type { PlaygroundMatch } from '@ts-unify/playground/app/types'

/**
 * The lines a match's rewrite leaves in place of the lines it spans.
 *
 * The text before the match on its first line and the text after it on
 * its last line are kept around the rewrite.
 *
 * @param lines the source, line by line
 * @param match the match, with its rewrite serialized
 * @returns the replacement lines
 */
export const rewrittenLines = (
  lines: readonly string[],
  match: PlaygroundMatch,
) =>
  (
    (lines[match.line - 1] ?? '').slice(0, match.column - 1) +
    (match.rewrite ?? '') +
    (lines[match.endLine - 1] ?? '').slice(match.endColumn - 1)
  ).split('\n')
