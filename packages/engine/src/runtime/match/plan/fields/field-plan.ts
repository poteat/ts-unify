import type { ArrayPlan } from '../arrays'
import type { Plan } from '../plan'

/**
 * One property of a fields record: its key and the plan of its value, an
 * array under a property being an array pattern.
 */
export type FieldPlan = { key: string; plan: Plan | ArrayPlan }
