import type { FieldPlan } from '@ts-unify/engine/runtime/match/plan/fields/types'

import Plans from './plans'
/**
 * The plan of one property of a fields record.
 *
 * @param key the property's key
 * @param value the pattern value under it
 */
export const fieldPlanAt = (key: string, value: unknown): FieldPlan => ({
  key,
  plan: Plans.fieldPlanOf(value),
})
