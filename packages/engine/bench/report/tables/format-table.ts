import Numbers from './numbers'
/**
 * Rows as a text table, each column as wide as its widest cell; a
 * column of numbers is right-aligned, one of text left-aligned.
 *
 * @param header the column names
 * @param rows the cells, one row per line
 */
export function formatTable(
  header: readonly string[],
  rows: readonly (readonly (string | number)[])[],
): string {
  const cells = rows.map(row =>
    row.map(c => (typeof c === 'number' ? Numbers.formatNumber(c) : c)),
  )
  const widths = header.map((h, i) =>
    Math.max(h.length, ...cells.map(row => row[i].length)),
  )
  const numeric = header.map((_, i) => typeof rows[0]?.[i] === 'number')
  const line = (row: readonly string[]) =>
    row
      .map((c, i) => (numeric[i] ? c.padStart(widths[i]) : c.padEnd(widths[i])))
      .join('  ')

  return [line(header), ...cells.map(line)].join('\n')
}
