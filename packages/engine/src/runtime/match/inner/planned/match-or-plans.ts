import type { Bag } from '../../bag'
import type { Cursor } from '../../context'
import type { Plan } from '../../plan'
import { matchPlan } from './match-plan'

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
