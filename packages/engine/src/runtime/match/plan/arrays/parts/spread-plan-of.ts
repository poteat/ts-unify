import type { SpreadPlan } from './spread-plan'

/**
 * The plan of a spread element, as `isSpread` admits one.
 *
 * @param spread the spread element
 */
export const spreadPlanOf = (spread: unknown): SpreadPlan => ({
  name: (spread as { name: string }).name,
})
