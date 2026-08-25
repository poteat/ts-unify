import Tallies from '@ts-unify/rules/inline-single-use-const/scan/tallies'
import type {
  Analysis,
  Inlinable,
  Tally,
} from '@ts-unify/rules/inline-single-use-const/scan/types'

import Candidates from './candidates'
import Inlinables from './inlinables'

/**
 * One block read once, last statement first, so that at each const the
 * tallies hold the statements after it; the first const that can be
 * inlined is the one found.
 *
 * @param body the block's statements
 * @param of the analysis of a block under this one
 */
export function analyze(
  body: readonly unknown[],
  of: (body: unknown[]) => Analysis,
): Analysis {
  const tallies = new Map<string, Tally>()
  let found: Inlinable | null = null
  let minEffectEnd = Infinity
  let nextEffectEnd = Infinity

  for (let index = body.length - 1; index >= 0; index--) {
    const candidate =
      index + 1 < body.length ? Candidates.candidateOf(body[index]) : null

    if (candidate) {
      const { name, init } = candidate
      const it = Inlinables.inlinableAt(
        index,
        name,
        init,
        tallies.get(name),
        nextEffectEnd,
      )
      if (it) found = it
    }

    nextEffectEnd = Tallies.tallyStatement(body[index], index, tallies, of)
    minEffectEnd = Math.min(minEffectEnd, nextEffectEnd)
  }

  return { found, tallies, minEffectEnd }
}
