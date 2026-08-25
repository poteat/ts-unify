import type { ArrayPlan } from '@engine/runtime/match/plan/arrays'
import type { Plan } from '@engine/runtime/match/plan/types'
/**
 * One property of a fields record: its key and the plan of its value, an
 * array under a property being an array pattern.
 */
export type FieldPlan = { key: string; plan: Plan | ArrayPlan }
