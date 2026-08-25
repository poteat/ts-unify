import type { CountPlan } from './counts'
import type { Quantifier } from './quantifiers'
/**
 * One `.where()` constraint: what it counts, the quantifier over the
 * count, and the count at which counting stops early.
 */
export type ConstraintPlan = CountPlan & {
  quantifier: Quantifier

  /**
   * One for `.none()`, whose first match decides; undefined otherwise.
   */
  limit: number | undefined
}
