/**
 * A camelCase name in kebab-case: `ifReturnToTernary` is
 * `if-return-to-ternary`.
 *
 * @param name the camelCase name
 * @returns the name in kebab-case
 */
export const kebabCase = (name: string) =>
  name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
