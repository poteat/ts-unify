import type { Cursor } from '@ts-unify/engine/runtime/match/context'
import Util from '@ts-unify/engine/runtime/match/inner/util'
import type { Plan } from '@ts-unify/engine/runtime/match/plan'
import type { Bag } from '@ts-unify/engine/runtime/types'

import Runs from './runs'
/**
 * Matches the element plans before the first spread at the array's head
 * and those after the last spread at its tail.
 *
 * Null when the array is too short for both runs or either fails.
 *
 * @param actual the array
 * @param ends the element plans before the first spread and after the last
 * @param at where the array sits in the match
 */
export function matchEndsPlans(
  actual: unknown[],
  ends: { before: readonly Plan[]; after: readonly Plan[] },
  at: Cursor,
): Bag | null {
  if (actual.length < ends.before.length + ends.after.length) return null
  const bag = Runs.matchRunPlans(
    actual,
    { elements: ends.before, start: 0 },
    at,
  )
  if (!bag) return null
  const start = actual.length - ends.after.length

  return Util.absorb(
    bag,
    Runs.matchRunPlans(actual, { elements: ends.after, start }, at),
  )
    ? bag
    : null
}
