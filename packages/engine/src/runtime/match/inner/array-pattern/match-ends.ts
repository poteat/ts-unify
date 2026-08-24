import type { Bag } from '../../bag'
import type { Cursor } from '../../context'
import Plan from '../../plan'
import { matchEndsPlans } from './match-ends-plans'

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
export const matchEnds = (
  actual: unknown[],
  ends: { before: unknown[]; after: unknown[] },
  at: Cursor,
): Bag | null =>
  matchEndsPlans(
    actual,
    {
      before: ends.before.map(Plan.planOf),
      after: ends.after.map(Plan.planOf),
    },
    at,
  )
