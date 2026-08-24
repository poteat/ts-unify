/**
 * A string as a RegExp source that matches it literally.
 *
 * @param text the text to match
 */
export const escapeRegExp = (text: string) =>
  text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
