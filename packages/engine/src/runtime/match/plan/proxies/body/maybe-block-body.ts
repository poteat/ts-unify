import type { Plan } from '../../plan'

/**
 * The body of a `U.maybeBlock(...)` proxy: the statement pattern looked
 * for through a one-statement block, or matched directly.
 */
export type MaybeBlockBody = { shape: 'maybeBlock'; statement: Plan }
