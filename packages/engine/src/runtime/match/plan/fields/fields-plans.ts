import { planMemo } from '../plan-memo'
import { buildFieldsPlan } from './build-fields-plan'

/**
 * The plans of fields records, kept by the record.
 */
export const fieldsPlans = planMemo(buildFieldsPlan)
