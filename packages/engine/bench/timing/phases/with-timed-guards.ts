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
 * @returns a copy of the rule whose `.when()` guards also add their time to the
 *          clock
 */
export function withTimedGuards(meta: RuleMeta, clock: GuardClock): RuleMeta {
  function timedEntry(entry: ChainEntry): ChainEntry {
    const guard = entry.args[0]
    const isWhenGuard = entry.method === 'when' && typeof guard === 'function'

    return isWhenGuard
      ? {
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
      : entry
  }

  return {
    ...meta,

    patterns: meta.patterns.map(p => ({
      ...p,
      chain: p.chain.map(timedEntry),
    })),
  }
}
