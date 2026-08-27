import Keys from './keys'

/**
 * A `JSON.stringify` replacer for the AST view: a dropped key writes
 * nothing, every other value writes as it is.
 *
 * @param key the property being written
 * @param value its value
 * @returns undefined for a dropped key, else the value
 */
export const astReplacer = (key: string, value: unknown) =>
  Keys.DROPPED_KEYS.has(key) ? undefined : value
