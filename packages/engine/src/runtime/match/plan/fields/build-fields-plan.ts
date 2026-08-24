import { REST_CAPTURE } from '@ts-unify/core/internal'

import { fieldPlanAt } from './field-plan-at'
import type { FieldsPlan } from './fields-plan'

/**
 * What a fields record asks: its own enumerable properties in order, and
 * the keys it names when it was written with `{ ...$ }`.
 *
 * @param record the fields record, or a primitive with no properties
 */
export function buildFieldsPlan(record: unknown): FieldsPlan {
  const rec = record as Record<string | symbol, unknown>

  return {
    kind: 'fields',
    fields: Object.entries(rec).map(([key, value]) => fieldPlanAt(key, value)),
    named: rec[REST_CAPTURE] ? new Set(Object.keys(rec)) : null,
  }
}
