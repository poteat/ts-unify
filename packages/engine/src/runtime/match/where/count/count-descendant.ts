import Plan from '../../plan'
import type { Constraint } from '../constraint'
import { countCursor } from './count-cursor'
import { countDescendantOf } from './count-descendant-of'

/**
 * How many of a node and its descendants match a constraint.
 *
 * A node matches at most once, an or-pattern's alternatives tried in
 * order; the descent stops under a boundary node, which is itself still
 * checked.
 *
 * @param node the node
 * @param constraint the pattern and its boundary
 * @param limit a count at which to stop early
 */
export const countDescendant = (
  node: unknown,
  constraint: Constraint,
  limit?: number,
): number =>
  countDescendantOf(
    node,
    {
      plan: Plan.countPlanOf(constraint.pattern, constraint.boundary),
      at: countCursor(),
    },
    limit,
  )
