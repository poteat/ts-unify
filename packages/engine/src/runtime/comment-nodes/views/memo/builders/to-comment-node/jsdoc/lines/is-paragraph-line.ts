import Tags from './tags'
/**
 * Whether the line at an index continues a paragraph: there is one, it
 * is not blank, and it opens no tag.
 *
 * @param lines the JSDoc's lines
 * @param i the index
 */
export const isParagraphLine = (lines: readonly string[], i: number) =>
  i < lines.length && lines[i] !== '' && !Tags.isTagLine(lines[i])
