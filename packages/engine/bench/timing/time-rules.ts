import { extractPatterns } from '@ts-unify/engine'
import { createRule } from '@ts-unify/eslint/internal'

import Best from './best'
import Phases from './phases'
import type { BenchRule, RuleTiming } from './types'
import Util from './util'
/**
 * The timings of every rule over the corpus: the match phase, the
 * rewrite phase over the matches it made, and the setup of the rule.
 *
 * @param rules each rule's meta beside the transform it came from
 * @param byType the corpus nodes by type
 * @returns one timing per rule, in the order given
 */
export const timeRules = (
  rules: readonly BenchRule[],
  byType: ReadonlyMap<string, readonly object[]>,
): RuleTiming[] =>
  rules.map(({ meta, transform }) => {
    const tried = { count: 0, admitted: 0 }
    const clock = { ms: 0 }
    const matching = Best.bestOf(Util.ROUNDS.match, () => {
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
    const [extracting, creating] = [
      () => extractPatterns(transform),
      () => createRule(transform as Parameters<typeof createRule>[0]),
    ].map(setup =>
      Best.bestOf(Util.ROUNDS.setup, () => {
        for (let i = 0; i < Util.ROUNDS.setupBatch; i++) setup()
      }),
    )

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
      extractUs:
        (extracting.ms * Util.ROUNDS.microsPerMs) / Util.ROUNDS.setupBatch,
      createRuleUs:
        (creating.ms * Util.ROUNDS.microsPerMs) / Util.ROUNDS.setupBatch,
    }
  })
