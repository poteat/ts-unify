import type { Bag } from '../../bag'
import type { Cursor } from '../../context'
import { absorb } from '../absorb'
import { matchRun } from './match-run'

/**
 * Matches the pattern elements before the first spread at the array's
 * head and those after the last spread at its tail.
 *
 * Null when the array is too short for both runs or either fails.
 *
 * @param actual the array
 * @param ends the elements before the first spread and after the last
 * @param at where the array sits in the match
 */
export function matchEnds(
  actual: unknown[],
  ends: { before: unknown[]; after: unknown[] },
  at: Cursor,
): Bag | null {
  if (actual.length < ends.before.length + ends.after.length) return null
  const bag = matchRun(actual, { elements: ends.before, start: 0 }, at)
  if (!bag) return null
  const start = actual.length - ends.after.length

  return absorb(bag, matchRun(actual, { elements: ends.after, start }, at))
    ? bag
    : null
}
