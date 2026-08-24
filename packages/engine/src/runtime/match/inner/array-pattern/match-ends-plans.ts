import type { Bag } from '../../bag'
import type { Cursor } from '../../context'
import type { Plan } from '../../plan'
import { absorb } from '../absorb'
import { matchRunPlans } from './match-run-plans'

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
  const bag = matchRunPlans(actual, { elements: ends.before, start: 0 }, at)
  if (!bag) return null
  const start = actual.length - ends.after.length

  return absorb(bag, matchRunPlans(actual, { elements: ends.after, start }, at))
    ? bag
    : null
}
