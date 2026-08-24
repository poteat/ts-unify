/**
 * A camelCase name in kebab-case: `myFancyRule` is `my-fancy-rule`; a name
 * already in kebab-case is returned as is.
 *
 * @param name an export name
 */
export const toKebab = (name: string) =>
  name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
