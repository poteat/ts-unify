import * as rules from '@ts-unify/rules'
import { extractRuleMeta } from '@ts-unify/runner'

/**
 * Every rule the rules package ships, with the metadata read off its
 * transform: the name in both spellings, the message, whether recommended.
 */
export const ALL_RULES = Object.entries(rules).map(([name, transform]) =>
  extractRuleMeta(name, transform),
)
