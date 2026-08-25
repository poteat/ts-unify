/**
 * One `@tag` of a JSDoc block: the tag name and the text after it.
 */
export type JsdocTag = {
  name: string

  /**
   * What follows the tag name, continuation lines joined by `\n`.
   */
  text: string
}
