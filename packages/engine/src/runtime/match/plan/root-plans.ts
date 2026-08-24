import { buildRootPlan } from './build-root-plan'
import { planMemo } from './plan-memo'

/**
 * The plans of root patterns, kept by the pattern object.
 */
export const rootPlans = planMemo(buildRootPlan)
