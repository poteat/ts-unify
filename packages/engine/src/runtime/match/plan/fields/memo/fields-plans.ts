import Builders from '@ts-unify/engine/runtime/match/plan/fields/builders'
import Memo from '@ts-unify/engine/runtime/match/plan/memo'
/**
 * The plans of fields records, kept by the record.
 */
export const fieldsPlans = Memo.planMemo(Builders.buildFieldsPlan)
