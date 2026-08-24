import type { Visitor } from './visitor'

/**
 * What `create` returns: one visitor per node type ESLint walks, keyed
 * by the type's name.
 */
export type Visitors = Record<string, Visitor>
