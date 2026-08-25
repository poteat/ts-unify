import type { FieldsPlan } from '@ts-unify/engine/runtime/match/plan/fields'
import type { DollarPlan } from '@ts-unify/engine/runtime/match/plan/values'
/**
 * What a `.where()` constraint counts over a subtree: the alternatives a
 * node matches at most one of, and the node types the count stops below.
 */
export type CountPlan = {
  alternatives: readonly { tag: string; fields: FieldsPlan | DollarPlan }[]

  /**
   * The node types an `.until()` boundary names; null without one.
   */
  boundaryTags: ReadonlySet<string> | null
}
