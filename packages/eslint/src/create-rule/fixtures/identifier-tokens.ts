/**
 * The words of a name: camelCase, snake_case and digit boundaries split,
 * lowercased.
 *
 * @param name an identifier
 */
export const identifierTokens = (name: string): ReadonlySet<string> =>
  new Set(
    name
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
      .replace(/([a-zA-Z])([0-9])/g, '$1 $2')
      .replace(/[_$-]+/g, ' ')
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean),
  )
