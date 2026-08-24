import type { ProxyNode } from '@ts-unify/core/internal'

/**
 * One `.where()` constraint: the pattern counted over a subtree, and the
 * `.until()` boundary below which the count stops, null without one.
 */
export type Constraint = { pattern: ProxyNode; boundary: unknown }
