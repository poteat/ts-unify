import type { PatternEntry } from '@ts-unify/engine'

/**
 * One entry pattern of one rule of a rule set: the rule beside the
 * entry's pattern and chain, the tag being the dispatcher's.
 */
export type RuleEntry<R> = {
  rule: R
  pattern: unknown
  chain: PatternEntry['chain']
}
