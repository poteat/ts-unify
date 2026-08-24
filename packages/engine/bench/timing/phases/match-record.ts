import type { PatternEntry } from '@ts-unify/engine'
import type { RuleMeta } from '@ts-unify/runner'

/**
 * One match a rule's entry pattern made: the rule, the node and the
 * entry, for the rewrite phase to match again and rewrite.
 *
 * A rewrite rebinds the match's captures in place, so each rewrite takes
 * a fresh match.
 */
export type MatchRecord = {
  rule: RuleMeta
  node: object
  entry: PatternEntry
}
