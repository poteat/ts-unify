import Rules from './rules'

/**
 * The rules of the catalog whose kebab names are in the enabled set.
 *
 * @param enabled the kebab names of the enabled rules
 * @returns the enabled rules, in catalog order
 */
export const enabledRules = (enabled: ReadonlySet<string>) =>
  Rules.ALL_RULES.filter(rule => enabled.has(rule.kebab))
