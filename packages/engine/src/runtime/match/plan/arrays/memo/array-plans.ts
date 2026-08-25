import Builders from '@ts-unify/engine/runtime/match/plan/arrays/builders'
import Memo from '@ts-unify/engine/runtime/match/plan/memo'
/**
 * The plans of array patterns, kept by the array.
 */
export const arrayPlans = Memo.planMemo(Builders.buildArrayPlan)
