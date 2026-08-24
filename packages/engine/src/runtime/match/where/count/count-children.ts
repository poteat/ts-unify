import Plan from '../../plan'
import type { Constraint } from '../constraint'
import { countChildrenOf } from './count-children-of'
import { countCursor } from './count-cursor'

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
  countChildrenOf(
    node,
    {
      plan: Plan.countPlanOf(constraint.pattern, constraint.boundary),
      at: countCursor(),
    },
    limit,
  )
