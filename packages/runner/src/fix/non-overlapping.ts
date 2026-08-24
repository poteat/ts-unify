import type { LintMatch } from '../lint'

/**
 * The matches in source order, minus every match that starts inside the
 * span of one kept before it, so their rewrites can be spliced in together.
 *
 * @param matches the matches to choose among
 */
export function nonOverlapping<M extends LintMatch>(
  matches: readonly M[],
): M[] {
  const sorted = [...matches].sort((a, b) =>
    a.line === b.line ? a.column - b.column : a.line - b.line,
  )
  const kept: M[] = []
  let lastEndLine = -1
  let lastEndCol = -1

  for (const m of sorted) {
    if (
      m.line > lastEndLine ||
      (m.line === lastEndLine && m.column >= lastEndCol)
    ) {
      kept.push(m)
      lastEndLine = m.endLine
      lastEndCol = m.endColumn
    }
  }

  return kept
}
