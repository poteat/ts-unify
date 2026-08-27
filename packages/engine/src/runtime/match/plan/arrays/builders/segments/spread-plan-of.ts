import type { SpreadPlan } from '@ts-unify/engine/runtime/match/plan/arrays/types'
import type { Named } from '@ts-unify/engine/runtime/match/types'
/**
 * The plan of a spread element, as `isSpread` admits one.
 *
 * @param spread the spread element
 * @returns a plan holding the spread's capture name
 */
export const spreadPlanOf = (spread: unknown): SpreadPlan => ({
  name: (spread as Named).name,
})
