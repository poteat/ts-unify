/**
 * Whether a JSDoc line opens a tag (`@param`, `@returns`).
 *
 * @param line the line, its leading `*` stripped
 */
export const isTagLine = (line: string) => /^@\w/.test(line)
