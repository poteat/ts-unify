/**
 * What one rule cost: the nodes tried, the matches made, and the
 * milliseconds of each phase.
 *
 * Of the match phase, `guardMs` is the part spent in the rule's own root
 * `.when()` guards.
 */
export type RuleTiming = {
  rule: string
  tags: string[]
  tried: number
  matched: number
  matchMs: number
  guardMs: number
  rewritten: number
  rewriteMs: number
  extractUs: number
  createRuleUs: number
}
