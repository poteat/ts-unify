import { buildFieldsPlan } from './build-fields-plan'
import type { FieldsPlan } from './fields-plan'
import { fieldsPlans } from './fields-plans'

/**
 * What a fields record asks, read once per record object; a primitive's
 * plan is read each time.
 *
 * @param record the fields record, or a primitive with no properties
 */
export const fieldsPlanOf = (record: unknown): FieldsPlan =>
  typeof record === 'object' && record
    ? fieldsPlans.of(record)
    : buildFieldsPlan(record)
