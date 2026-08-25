import Memo from '@ts-unify/engine/runtime/match/plan/memo'

import Builders from './builders'
/**
 * The plans of root patterns, kept by the pattern object.
 */
export const rootPlans = Memo.planMemo(Builders.buildRootPlan)
