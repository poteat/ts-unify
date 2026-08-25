import Plan from '@ts-unify/engine/runtime/match/plan'
import type { Constraint } from '@ts-unify/engine/runtime/match/where/types'

import Children from './children'
import Util from './util'
/**
 * How many descendants of a node match a constraint, the node itself not
 * counted.
 *
 * @param node the node whose children are walked
 * @param constraint the pattern and its boundary
 * @param limit a count at which to stop early
 */
export const countChildren = (
  node: unknown,
  constraint: Constraint,
  limit?: number,
): number =>
  Children.countChildrenOf(
    node,
    {
      plan: Plan.countPlanOf(constraint.pattern, constraint.boundary),
      at: Util.countCursor(),
    },
    limit,
  )
