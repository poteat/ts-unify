import Tags from './tags'
/**
 * Whether the line at an index continues a paragraph: there is one, it
 * is not blank, and it opens no tag.
 *
 * @param lines the JSDoc's lines
 * @param i the index
 * @returns true when the line exists, is not blank, and opens no tag
 */
export const isParagraphLine = (lines: readonly string[], i: number) =>
  i < lines.length && lines[i] !== '' && !Tags.isTagLine(lines[i])
