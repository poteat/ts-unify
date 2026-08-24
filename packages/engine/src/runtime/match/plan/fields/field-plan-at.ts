import type { FieldPlan } from './field-plan'
import { fieldPlanOf } from './field-plan-of'

/**
 * The plan of one property of a fields record.
 *
 * @param key the property's key
 * @param value the pattern value under it
 */
export const fieldPlanAt = (key: string, value: unknown): FieldPlan => ({
  key,
  plan: fieldPlanOf(value),
})
