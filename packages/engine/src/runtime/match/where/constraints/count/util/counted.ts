import Plan from '@ts-unify/engine/runtime/match/plan'
import type { Count } from '@ts-unify/engine/runtime/match/where/constraints/count/types'
import { countCursor } from '@ts-unify/engine/runtime/match/where/constraints/count/util/count-cursor'
import type { Constraint } from '@ts-unify/engine/runtime/match/where/types'
/**
 * A count over a constraint from a count over a plan: the constraint's
 * pattern and boundary planned, the matches made under a fresh cursor.
 *
 * @param count how many of a node, or of its children, match a count
 * @returns the same count over a node and a constraint, with a limit
 */
export const counted =
  (count: (node: unknown, count: Count, limit?: number) => number) =>
  (node: unknown, constraint: Constraint, limit?: number): number =>
    count(
      node,
      {
        plan: Plan.countPlanOf(constraint.pattern, constraint.boundary),
        at: countCursor(),
      },
      limit,
    )
