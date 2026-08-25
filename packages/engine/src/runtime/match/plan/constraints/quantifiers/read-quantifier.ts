import Chain from '@engine/runtime/match/chain'
import type { Quantifier } from '@engine/runtime/match/plan/constraints/types'
import type { ChainEntry } from '@ts-unify/core/internal'
/**
 * The quantifier a constraint's chain carries: `.none()`, `.some()`,
 * `.atLeast(n)`, `.atMost(n)` or `.exactly(n)`; null without one.
 *
 * @param chain the constraint's chain
 */
export function readQuantifier(chain: ChainEntry[]): Quantifier | null {
  if (Chain.chainHas(chain, 'none')) return { kind: 'none', test: n => n === 0 }
  if (Chain.chainHas(chain, 'some')) return { kind: 'some', test: n => n > 0 }
  const atLeast = Chain.chainGet(chain, 'atLeast')

  if (atLeast) {
    const k = (atLeast.args[0] ?? 0) as number

    return { kind: 'atLeast', test: n => n >= k }
  }

  const atMost = Chain.chainGet(chain, 'atMost')

  if (atMost) {
    const k = (atMost.args[0] ?? 0) as number

    return { kind: 'atMost', test: n => n <= k }
  }

  const exactly = Chain.chainGet(chain, 'exactly')

  if (exactly) {
    const k = (exactly.args[0] ?? 0) as number

    return { kind: 'exactly', test: n => n === k }
  }

  return null
}
