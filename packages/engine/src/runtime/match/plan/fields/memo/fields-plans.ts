import Builders from '@engine/runtime/match/plan/fields/builders'
import Memo from '@engine/runtime/match/plan/memo'
/**
 * The plans of fields records, kept by the record.
 */
export const fieldsPlans = Memo.planMemo(Builders.buildFieldsPlan)
