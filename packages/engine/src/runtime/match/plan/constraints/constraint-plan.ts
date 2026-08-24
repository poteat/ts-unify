import type { CountPlan } from './count-plan'
import type { Quantifier } from './quantifier'

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
