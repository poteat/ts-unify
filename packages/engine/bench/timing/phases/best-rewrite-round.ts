import { ROUNDS } from '../rounds'
import type { MatchRecord } from './match-record'
import { rewriteMatch } from './rewrite-match'

/**
 * The rewrite phase over a rule's matches, the round with the least time
 * in the rewrites and their prints: how many printed, and that time.
 *
 * @param records the rule's matches
 */
export function bestRewriteRound(records: readonly MatchRecord[]): {
  printed: number
  ms: number
} {
  let best = { printed: 0, ms: Infinity }

  for (let round = 0; round < ROUNDS.rewrite; round++) {
    let printed = 0
    let ms = 0

    for (const record of records) {
      const rewrite = rewriteMatch(record)
      if (rewrite.text === null) continue
      printed++
      ms += rewrite.ms
    }

    if (ms < best.ms) best = { printed, ms }
  }

  return best
}
