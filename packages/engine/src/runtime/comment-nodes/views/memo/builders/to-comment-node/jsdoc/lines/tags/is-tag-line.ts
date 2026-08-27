/**
 * Whether a JSDoc line opens a tag (`@param`, `@returns`).
 *
 * @param line the line, its leading `*` stripped
 * @returns true when the line starts with `@` followed by a word character
 */
export const isTagLine = (line: string) => /^@\w/.test(line)
