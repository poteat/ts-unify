import type { ChainEntry } from '@ts-unify/core/internal'

import Chain from '../../chain'
import Pattern from '../../pattern'
import type { ConstraintPlan } from './constraint-plan'
import { countPlanOf } from './count-plan-of'
import Quantifier from './quantifier'

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
      const quantifier = Quantifier.readQuantifier(pattern.chain)
      if (!quantifier) continue

      plans.push({
        ...countPlanOf(pattern, boundary),
        quantifier,
        limit: quantifier.kind === 'none' ? 1 : undefined,
      })
    }
  }

  return plans
}
