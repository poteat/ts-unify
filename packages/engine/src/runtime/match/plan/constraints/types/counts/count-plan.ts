import type { CountAlternative } from './alternatives'

/**
 * What a `.where()` constraint counts over a subtree: the alternatives a
 * node matches at most one of, and the node types the count stops below.
 */
export type CountPlan = {
  alternatives: readonly CountAlternative[]

  /**
   * The node types an `.until()` boundary names; null without one.
   */
  boundaryTags: ReadonlySet<string> | null
}
