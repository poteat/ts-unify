import type { Plan } from '../../plan'

/**
 * The body of a `U.or(...)` proxy: its alternatives, tried in order.
 */
export type OrBody = { shape: 'or'; alternatives: readonly Plan[] }
