import Memo from './memo'
import type { ArrayPlan } from './types'
/**
 * What an array pattern under a property asks, read once per array
 * object.
 *
 * @param expected the array pattern
 * @returns the memoized `ArrayPlan` of the array pattern
 */
export const arrayPlanOf = (expected: unknown[]): ArrayPlan =>
  Memo.arrayPlans.of(expected)
