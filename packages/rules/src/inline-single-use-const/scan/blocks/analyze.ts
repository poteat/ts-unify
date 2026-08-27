import Tallies from '@ts-unify/rules/inline-single-use-const/scan/tallies'
import type {
  Analysis,
  Inlinable,
  Scanning,
  Tally,
} from '@ts-unify/rules/inline-single-use-const/scan/types'

import Candidates from './candidates'
import Inlinables from './inlinables'

/**
 * One block read once, last statement first, so that at each const the
 * tallies hold the statements after it.
 *
 * The first const that can be inlined is the one found.
 *
 * @param body the block's statements
 * @param analysisOf the analysis of a block under this one
 * @returns the const found or null, the tallies, and the earliest effect end
 */
export function analyze(
  body: readonly unknown[],
  analysisOf: (body: unknown[]) => Analysis,
): Analysis {
  const tallies = new Map<string, Tally>()
  const scanning: Scanning = { tallies, analysisOf }
  let found: Inlinable | null = null
  let minEffectEnd = Infinity
  let nextEffectEnd = Infinity

  for (let index = body.length - 1; index >= 0; index--) {
    const candidate =
      index + 1 < body.length ? Candidates.candidateOf(body[index]) : null

    if (candidate) {
      const it = Inlinables.inlinableAt(
        { index, ...candidate },
        tallies.get(candidate.name),
        nextEffectEnd,
      )
      if (it) found = it
    }

    nextEffectEnd = Tallies.tallyStatement(scanning, index, body[index])
    minEffectEnd = Math.min(minEffectEnd, nextEffectEnd)
  }

  return { found, tallies, minEffectEnd }
}
