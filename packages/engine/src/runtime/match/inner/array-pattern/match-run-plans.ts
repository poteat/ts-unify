import type { Bag } from '../../bag'
import Context from '../../context'
import type { Plan } from '../../plan'
import { absorb } from '../absorb'
import Planned from '../planned'

/**
 * Matches a run of element plans against the array elements from an
 * index on: their merged captures, or null at the first mismatch.
 *
 * @param actual the array
 * @param run the element plans and the array index the first aligns to
 * @param at where the array sits in the match
 */
export function matchRunPlans(
  actual: unknown[],
  run: { elements: readonly Plan[]; start: number },
  at: Context.Cursor,
): Bag | null {
  const bag: Bag = {}

  for (let i = 0; i < run.elements.length; i++) {
    const index = run.start + i

    if (
      !absorb(
        bag,
        Planned.matchPlan(
          actual[index],
          run.elements[i],
          Context.childCursor(at, index),
        ),
      )
    )
      return null
  }

  return bag
}
