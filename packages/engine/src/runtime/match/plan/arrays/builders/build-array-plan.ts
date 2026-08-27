import Pattern from '@ts-unify/engine/runtime/match/pattern'
import type { ArrayPlan } from '@ts-unify/engine/runtime/match/plan/arrays/types'
import { planOf } from '@ts-unify/engine/runtime/match/plan/plan-of'
import Seqs from '@ts-unify/engine/runtime/match/seqs'

import Segments from './segments'
/**
 * What an array pattern asks: its seqs expanded, its spreads found, and
 * the runs of elements around them planned.
 *
 * @param expected the array pattern
 * @returns an `ArrayPlan` with the spreads, the runs before, between and after
 *          them, the first spread's index and the seq plans
 */
export function buildArrayPlan(expected: unknown[]): ArrayPlan {
  const { expanded, seqs } = Seqs.expandSeqs(expected)
  const spreadAt = expanded.flatMap((e, i) => (Pattern.isSpread(e) ? [i] : []))
  const run = (start: number, end?: number) =>
    expanded.slice(start, end).map(planOf)
  const [s1, s2] = spreadAt
  const hasOneSpread = spreadAt.length === 1
  const hasTwoSpreads = spreadAt.length === 2

  return {
    kind: 'array',
    spreads: spreadAt.map(i => Segments.spreadPlanOf(expanded[i])),
    before:
      spreadAt.length > 2 ? [] : run(0, spreadAt.length === 0 ? undefined : s1),
    middle: hasTwoSpreads ? run(s1 + 1, s2) : [],
    after: hasOneSpread ? run(s1 + 1) : hasTwoSpreads ? run(s2 + 1) : [],
    firstSpread: spreadAt.length === 0 ? -1 : s1,
    seqs: seqs.map(Segments.seqPlanOf),
  }
}
