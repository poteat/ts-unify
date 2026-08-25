import type { ChainEntry } from '@ts-unify/core/internal'
import type { RuleMeta } from '@ts-unify/runner'

import type { GuardClock } from './types'
/**
 * The rule with every root `.when()` guard of its entry patterns wrapped
 * to add its time to the clock.
 *
 * The match is the same; the clock tells the rule's own guard time from
 * the engine's.
 *
 * @param meta the rule
 * @param clock the clock the guards add to
 */
export function withTimedGuards(meta: RuleMeta, clock: GuardClock): RuleMeta {
  function timedEntry(entry: ChainEntry): ChainEntry {
    const guard = entry.args[0]

    return entry.method !== 'when' || typeof guard !== 'function'
      ? entry
      : {
          method: 'when',

          args: [
            (bag: unknown) => {
              const start = performance.now()
              const verdict: unknown = guard(bag)
              clock.ms += performance.now() - start

              return verdict
            },
          ],
        }
  }

  return {
    ...meta,

    patterns: meta.patterns.map(p => ({
      ...p,
      chain: p.chain.map(timedEntry),
    })),
  }
}
