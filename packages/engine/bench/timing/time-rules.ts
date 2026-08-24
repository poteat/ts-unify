import { extractPatterns } from '@ts-unify/engine'
import { createRule } from '@ts-unify/eslint/internal'
import type { RuleMeta } from '@ts-unify/runner'

import { bestOf } from './best-of'
import Phases from './phases'
import { ROUNDS } from './rounds'
import type { RuleTiming } from './rule-timing'

/**
 * The timings of every rule over the corpus: the match phase, the
 * rewrite phase over the matches it made, and the setup of the rule.
 *
 * @param rules each rule's meta beside the transform it came from
 * @param byType the corpus nodes by type
 */
export const timeRules = (
  rules: readonly { meta: RuleMeta; transform: unknown }[],
  byType: ReadonlyMap<string, readonly object[]>,
): RuleTiming[] =>
  rules.map(({ meta, transform }) => {
    const tried = { count: 0, admitted: 0 }
    const clock = { ms: 0 }
    const matching = bestOf(ROUNDS.match, () => {
      tried.count = 0
      tried.admitted = 0
      clock.ms = 0

      return {
        records: Phases.matchRule(
          Phases.withTimedGuards(meta, clock),
          byType,
          tried,
        ),
        guardMs: clock.ms,
      }
    })
    const rewriting = Phases.bestRewriteRound(matching.result.records)
    const extracting = bestOf(ROUNDS.setup, () => {
      for (let i = 0; i < ROUNDS.setupBatch; i++) extractPatterns(transform)
    })
    const creating = bestOf(ROUNDS.setup, () => {
      for (let i = 0; i < ROUNDS.setupBatch; i++) {
        createRule(transform as Parameters<typeof createRule>[0])
      }
    })

    return {
      rule: meta.kebab,
      tags: Array.from(new Set(meta.patterns.map(p => p.tag))),
      tried: tried.count,
      admitted: tried.admitted,
      matched: matching.result.records.length,
      matchMs: matching.ms,
      guardMs: matching.result.guardMs,
      rewritten: rewriting.printed,
      rewriteMs: rewriting.ms,
      extractUs: (extracting.ms * ROUNDS.microsPerMs) / ROUNDS.setupBatch,
      createRuleUs: (creating.ms * ROUNDS.microsPerMs) / ROUNDS.setupBatch,
    }
  })
