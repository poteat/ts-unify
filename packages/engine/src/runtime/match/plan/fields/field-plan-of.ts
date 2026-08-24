import Arrays from '../arrays'
import type { ArrayPlan } from '../arrays'
import type { Plan } from '../plan'
import { planOf } from '../plan-of'

/**
 * What a pattern value asks under a property of a fields record: an
 * array is an array pattern there, anything else as at a value position.
 *
 * @param value the pattern value
 */
export const fieldPlanOf = (value: unknown): Plan | ArrayPlan =>
  Array.isArray(value) ? Arrays.arrayPlanOf(value) : planOf(value)
