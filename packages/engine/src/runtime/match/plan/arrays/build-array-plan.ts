import Pattern from '../../pattern'
import Seqs from '../../seqs'
import { planOf } from '../plan-of'
import type { ArrayPlan } from './array-plan'
import Parts from './parts'

/**
 * What an array pattern asks: its seqs expanded, its spreads found, and
 * the runs of elements around them planned.
 *
 * @param expected the array pattern
 */
export function buildArrayPlan(expected: unknown[]): ArrayPlan {
  const { expanded, seqs } = Seqs.expandSeqs(expected)
  const spreadAt = expanded.flatMap((e, i) => (Pattern.isSpread(e) ? [i] : []))
  const run = (start: number, end?: number) =>
    expanded.slice(start, end).map(planOf)
  const [s1, s2] = spreadAt

  return {
    kind: 'array',
    spreads: spreadAt.map(i => Parts.spreadPlanOf(expanded[i])),
    before:
      spreadAt.length > 2 ? [] : run(0, spreadAt.length === 0 ? undefined : s1),
    middle: spreadAt.length === 2 ? run(s1 + 1, s2) : [],
    after:
      spreadAt.length === 1
        ? run(s1 + 1)
        : spreadAt.length === 2
          ? run(s2 + 1)
          : [],
    firstSpread: spreadAt.length === 0 ? -1 : s1,
    seqs: seqs.map(Parts.seqPlanOf),
  }
}
