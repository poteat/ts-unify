import type { Cursor } from '@ts-unify/engine/runtime/match/context'
import Plan from '@ts-unify/engine/runtime/match/plan'
import type { Bag } from '@ts-unify/engine/runtime/types'

import Plans from './plans'
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
  Plans.matchEndsPlans(
    actual,
    {
      before: ends.before.map(Plan.planOf),
      after: ends.after.map(Plan.planOf),
    },
    at,
  )
