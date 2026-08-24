import type { Bag } from '../../bag'
import type { Cursor } from '../../context'
import Plan from '../../plan'
import { matchRunPlans } from './match-run-plans'

/**
 * Matches a run of pattern elements against the array elements from an
 * index on, and returns their merged captures.
 *
 * Null at the first element that does not match.
 *
 * @param actual the array
 * @param run the pattern elements and the array index the first aligns to
 * @param at where the array sits in the match
 */
export const matchRun = (
  actual: unknown[],
  run: { elements: unknown[]; start: number },
  at: Cursor,
): Bag | null =>
  matchRunPlans(
    actual,
    { elements: run.elements.map(Plan.planOf), start: run.start },
    at,
  )
