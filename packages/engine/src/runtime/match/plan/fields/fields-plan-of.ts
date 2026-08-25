import Builders from './builders'
import Memo from './memo'
import type { FieldsPlan } from './types'
/**
 * What a fields record asks, read once per record object; a primitive's
 * plan is read each time.
 *
 * @param record the fields record, or a primitive with no properties
 */
export const fieldsPlanOf = (record: unknown): FieldsPlan =>
  typeof record === 'object' && record
    ? Memo.fieldsPlans.of(record)
    : Builders.buildFieldsPlan(record)
