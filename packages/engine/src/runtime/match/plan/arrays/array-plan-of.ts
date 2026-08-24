import type { ArrayPlan } from './array-plan'
import { arrayPlans } from './array-plans'

/**
 * What an array pattern under a property asks, read once per array
 * object.
 *
 * @param expected the array pattern
 */
export const arrayPlanOf = (expected: unknown[]): ArrayPlan =>
  arrayPlans.of(expected)
