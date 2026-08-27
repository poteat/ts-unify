import type { DiffRow } from '@ts-unify/playground/app/panes/diff/types'

/**
 * The rows of lines kept as they are, from one line number to another,
 * both included; none when the range is empty.
 *
 * @param lines the source, line by line
 * @param first the first line's number
 * @param last the last line's number
 * @returns one context row per line
 */
export const contextRows = (
  lines: readonly string[],
  first: number,
  last: number,
): DiffRow[] =>
  Array.from({ length: Math.max(0, last - first + 1) }, (_, i) => ({
    kind: 'ctx',
    num: first + i,
    line: lines[first + i - 1] ?? '',
  }))
