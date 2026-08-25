import type { ChainEntry } from '@ts-unify/core/internal'
import Chain from '@ts-unify/engine/runtime/match/chain'
import Pattern from '@ts-unify/engine/runtime/match/pattern'

import Counts from './counts'
import Quantifiers from './quantifiers'
import type { ConstraintPlan } from './types'
/**
 * The `.where()` constraints of a chain that carry a quantifier, in chain
 * order; a constraint that is no proxy, or has no quantifier, is left out.
 *
 * @param chain the chain
 */
export function constraintPlansOf(chain: ChainEntry[]): ConstraintPlan[] {
  const plans: ConstraintPlan[] = []

  for (const entry of chain) {
    if (entry.method !== 'where') continue

    for (const constraint of entry.args) {
      if (!Pattern.isProxyNode(constraint)) continue
      const pattern = Pattern.patternNodeOf(constraint)
      const boundary = Chain.chainGet(pattern.chain, 'until')?.args[0] ?? null
      const quantifier = Quantifiers.readQuantifier(pattern.chain)
      if (!quantifier) continue

      plans.push({
        ...Counts.countPlanOf(pattern, boundary),
        quantifier,
        limit: quantifier.kind === 'none' ? 1 : undefined,
      })
    }
  }

  return plans
}
