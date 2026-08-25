import Arrays from '@ts-unify/engine/runtime/match/plan/arrays'
import type { ArrayPlan } from '@ts-unify/engine/runtime/match/plan/arrays'
import { planOf } from '@ts-unify/engine/runtime/match/plan/plan-of'
import type { Plan } from '@ts-unify/engine/runtime/match/plan/types'
/**
 * What a pattern value asks under a property of a fields record: an
 * array is an array pattern there, anything else as at a value position.
 *
 * @param value the pattern value
 */
export const fieldPlanOf = (value: unknown): Plan | ArrayPlan =>
  Array.isArray(value) ? Arrays.arrayPlanOf(value) : planOf(value)
