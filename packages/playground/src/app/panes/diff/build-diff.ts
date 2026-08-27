import type { PlaygroundMatch } from '@ts-unify/playground/app/types'
import { nonOverlapping } from '@ts-unify/runner'

import Lines from './lines'
import type { DiffRow } from './types'

/**
 * The diff view's rows: the source with every non-overlapping rewrite
 * applied, the lines a match spans removed and its rewrite added.
 *
 * @param code the source text
 * @param matches the matches, those without a rewrite skipped
 * @returns the rows, in source order
 */
export function buildDiff(code: string, matches: PlaygroundMatch[]): DiffRow[] {
  const lines = code.split('\n')
  const usable = nonOverlapping(matches.filter(match => match.rewrite != null))
  const rows: DiffRow[] = []
  let cursor = 1

  for (const match of usable) {
    rows.push(...Lines.contextRows(lines, cursor, match.line - 1))

    for (let l = match.line; l <= match.endLine; l++) {
      rows.push({ kind: 'del', num: l, line: lines[l - 1] ?? '' })
    }

    for (const line of Lines.rewrittenLines(lines, match)) {
      rows.push({ kind: 'add', line })
    }

    cursor = match.endLine + 1
  }

  rows.push(...Lines.contextRows(lines, cursor, lines.length))

  return rows
}
