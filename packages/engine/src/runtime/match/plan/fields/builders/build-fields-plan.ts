import { REST_CAPTURE } from '@ts-unify/core/internal'
import type { FieldsPlan } from '@ts-unify/engine/runtime/match/plan/fields/types'

import Entries from './entries'
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
    fields: Object.entries(rec).map(([key, value]) =>
      Entries.fieldPlanAt(key, value),
    ),
    named: rec[REST_CAPTURE] ? new Set(Object.keys(rec)) : null,
  }
}
