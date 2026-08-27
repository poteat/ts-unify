import type { Cursor } from '@ts-unify/engine/runtime/match/context'
import { matchPlan } from '@ts-unify/engine/runtime/match/inner/planned/match-plan'
import type { Plan } from '@ts-unify/engine/runtime/match/plan'
import type { Bag } from '@ts-unify/engine/runtime/types'
/**
 * Matches a value against the plans of a `U.or(...)`'s alternatives, in
 * order, and returns the first one's captures; null when none matches.
 *
 * @param actual the value
 * @param alternatives the alternatives' plans
 * @param at where the value sits in the match
 * @returns the first matching alternative's captures, or null when none matches
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
