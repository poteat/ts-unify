import type { Cursor } from '@ts-unify/engine/runtime/match/context'
import Plan from '@ts-unify/engine/runtime/match/plan'
import type { Bag } from '@ts-unify/engine/runtime/types'

import Plans from './plans'
import type { Run } from './types'
/**
 * Matches a run of pattern elements against the array elements from an
 * index on, and returns their merged captures.
 *
 * Null at the first element that does not match.
 *
 * @param actual the array
 * @param run the pattern elements and the array index the first aligns to
 * @param at where the array sits in the match
 * @returns the merged captures of the run's elements, or null at the first
 *          mismatch
 */
export const matchRun = (
  actual: unknown[],
  run: Run<unknown>,
  at: Cursor,
): Bag | null =>
  Plans.matchRunPlans(
    actual,
    { elements: run.elements.map(Plan.planOf), start: run.start },
    at,
  )
