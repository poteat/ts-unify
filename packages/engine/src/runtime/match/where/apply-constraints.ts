import type { ConstraintPlan } from '../plan'
import Count from './count'

/**
 * Whether a node satisfies every `.where()` constraint of a chain: each
 * quantifier over the count of its pattern among the node's descendants.
 *
 * @param constraints the constraints, in chain order
 * @param actual the matched node, whose descendants are counted
 */
export function applyConstraints(
  constraints: readonly ConstraintPlan[],
  actual: unknown,
) {
  if (constraints.length === 0) return true
  const at = Count.countCursor()

  for (const constraint of constraints) {
    if (
      !constraint.quantifier.test(
        Count.countChildrenOf(
          actual,
          { plan: constraint, at },
          constraint.limit,
        ),
      )
    ) {
      return false
    }
  }

  return true
}
