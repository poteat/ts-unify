/**
 * The lines of a JSDoc value with the leading `*` of each stripped, and
 * the blank lines at either end dropped.
 *
 * @param value the comment's text between its delimiters
 * @returns the stripped lines, with no blank line first or last
 */
export function jsdocLines(value: string): string[] {
  const lines = value
    .replace(/^\* ?/, '')
    .split('\n')
    .map(l => l.replace(/^\s*\*\s?/, '').replace(/\s+$/, ''))
  let start = 0
  let end = lines.length

  while (start < end && lines[start] === '') start++

  while (end > start && lines[end - 1] === '') end--

  return lines.slice(start, end)
}
