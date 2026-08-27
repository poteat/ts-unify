/**
 * A string as a RegExp source that matches it literally.
 *
 * @param text the text to match
 * @returns the text with every RegExp metacharacter backslash-escaped
 */
export const escapeRegExp = (text: string) =>
  text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
