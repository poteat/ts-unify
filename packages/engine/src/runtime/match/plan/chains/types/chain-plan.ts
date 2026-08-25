import type { ConstraintPlan } from '@engine/runtime/match/plan/constraints'
import type { RewriteFactory } from '@engine/runtime/match/types'
import type { Bag } from '@engine/runtime/types'
/**
 * What a proxy's chain does to a match, read once from its entries.
 */
export type ChainPlan = {
  /**
   * The `.when()` guards, in chain order.
   */
  whens: readonly ((bag: Bag) => unknown)[]

  /**
   * The first `.bind()`: its name, undefined for a bare `.bind()`; null
   * without one.
   */
  bind: { name: string | undefined } | null

  /**
   * Whether the chain carries `.seal()`.
   */
  seal: boolean

  /**
   * What the first `.to()` builds, a bare `.to()` yielding the bag's
   * first value; undefined without one.
   */
  factory: RewriteFactory | undefined

  /**
   * The defaults of the first `.config()`; empty without one.
   */
  configDefaults: Bag

  /**
   * The `.where()` constraints with a quantifier, in chain order.
   */
  constraints: readonly ConstraintPlan[]
}
