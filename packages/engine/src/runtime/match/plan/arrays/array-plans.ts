import { planMemo } from '../plan-memo'
import { buildArrayPlan } from './build-array-plan'

/**
 * The plans of array patterns, kept by the array.
 */
export const arrayPlans = planMemo(buildArrayPlan)
