import Catalog from './catalog'

/**
 * The kebab names of the rules on when the playground opens: the
 * recommended ones.
 */
export const DEFAULT_ENABLED: readonly string[] = Catalog.ALL_RULES.filter(
  rule => rule.isRecommended,
).map(rule => rule.kebab)
