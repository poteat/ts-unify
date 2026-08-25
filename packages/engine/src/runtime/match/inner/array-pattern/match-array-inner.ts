import type { Cursor } from '@engine/runtime/match/context'
import Plan from '@engine/runtime/match/plan'
import type { Bag } from '@engine/runtime/types'

import Plans from './plans'
/**
 * Matches an array against an array pattern holding up to two spread
 * captures, and returns the captures; null on mismatch.
 *
 * With no spread the lengths must agree. One spread takes whatever the
 * elements around it leave. Two spreads take what is before and after the
 * first place the elements between them match.
 *
 * @param actual the array
 * @param expected the array pattern
 * @param at where the array sits in the match
 */
export const matchArrayInner = (
  actual: unknown[],
  expected: unknown[],
  at: Cursor,
): Bag | null => Plans.matchArrayPlan(actual, Plan.arrayPlanOf(expected), at)
