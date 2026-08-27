import Util from '@bench/timing/util'

import Rewrites from './rewrites'
import type { MatchRecord, RewriteRound } from './types'
/**
 * The rewrite phase over a rule's matches, the round with the least time
 * in the rewrites and their prints: how many printed, and that time.
 *
 * @param records the rule's matches
 * @returns the fastest round's printed count and its milliseconds
 */
export function bestRewriteRound(
  records: readonly MatchRecord[],
): RewriteRound {
  let best = { printed: 0, ms: Infinity }

  for (let round = 0; round < Util.ROUNDS.rewrite; round++) {
    let printed = 0
    let ms = 0

    for (const record of records) {
      const rewrite = Rewrites.rewriteMatch(record)
      if (rewrite.text === null) continue
      printed++
      ms += rewrite.ms
    }

    if (ms < best.ms) best = { printed, ms }
  }

  return best
}
