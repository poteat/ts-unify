import type { Cursor } from '@engine/runtime/match/context'
import { matchPlan } from '@engine/runtime/match/inner/planned/match-plan'
import type { Plan } from '@engine/runtime/match/plan'
import type { Bag } from '@engine/runtime/types'
/**
 * Matches a value against the plans of a `U.or(...)`'s alternatives, in
 * order, and returns the first one's captures; null when none matches.
 *
 * @param actual the value
 * @param alternatives the alternatives' plans
 * @param at where the value sits in the match
 */
export function matchOrPlans(
  actual: unknown,
  alternatives: readonly Plan[],
  at: Cursor,
): Bag | null {
  for (const alternative of alternatives) {
    const result = matchPlan(actual, alternative, at)
    if (result) return result
  }

  return null
}
