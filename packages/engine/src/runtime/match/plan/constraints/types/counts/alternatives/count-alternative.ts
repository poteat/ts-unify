import type { FieldsPlan } from '@ts-unify/engine/runtime/match/plan/fields'
import type { DollarPlan } from '@ts-unify/engine/runtime/match/plan/values'

/**
 * One alternative a counted node matches: its node type, and the plan
 * its fields are matched by.
 */
export type CountAlternative = {
  tag: string
  fields: FieldsPlan | DollarPlan
}
