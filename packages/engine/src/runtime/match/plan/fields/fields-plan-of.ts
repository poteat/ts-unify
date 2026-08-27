import Builders from './builders'
import Memo from './memo'
import type { FieldsPlan } from './types'
/**
 * What a fields record asks, read once per record object; a primitive's
 * plan is read each time.
 *
 * @param record the fields record, or a primitive with no properties
 * @returns the record's memoized `FieldsPlan`, or a fresh one for a primitive
 */
export function fieldsPlanOf(record: unknown): FieldsPlan {
  const isObject = typeof record === 'object' && record

  return isObject
    ? Memo.fieldsPlans.of(record)
    : Builders.buildFieldsPlan(record)
}
