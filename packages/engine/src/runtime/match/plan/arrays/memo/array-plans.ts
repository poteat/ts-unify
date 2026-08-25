import Builders from '@engine/runtime/match/plan/arrays/builders'
import Memo from '@engine/runtime/match/plan/memo'
/**
 * The plans of array patterns, kept by the array.
 */
export const arrayPlans = Memo.planMemo(Builders.buildArrayPlan)
