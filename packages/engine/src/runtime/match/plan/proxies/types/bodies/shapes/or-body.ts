import type { Plan } from '@engine/runtime/match/plan/types'
/**
 * The body of a `U.or(...)` proxy: its alternatives, tried in order.
 */
export type OrBody = { shape: 'or'; alternatives: readonly Plan[] }
