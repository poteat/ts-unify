import type { ChainEntry } from '@ts-unify/core/internal'
import Chain from '@ts-unify/engine/runtime/match/chain'
import type { Quantifier } from '@ts-unify/engine/runtime/match/plan/constraints/types'

import Bounded from './bounded'
/**
 * The quantifier a constraint's chain carries: `.none()`, `.some()`,
 * `.atLeast(n)`, `.atMost(n)` or `.exactly(n)`; null without one.
 *
 * @param chain the constraint's chain
 * @returns the quantifier's kind and its test over a count, or null without one
 */
export function readQuantifier(chain: ChainEntry[]): Quantifier | null {
  if (Chain.chainHas(chain, 'none')) return { kind: 'none', test: n => n === 0 }
  if (Chain.chainHas(chain, 'some')) return { kind: 'some', test: n => n > 0 }

  for (const { kind, holds } of Bounded.BOUNDED) {
    const entry = Chain.chainGet(chain, kind)

    if (entry) {
      const k = (entry.args[0] ?? 0) as number

      return { kind, test: n => holds(n, k) }
    }
  }

  return null
}
