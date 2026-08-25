import Context from '@ts-unify/engine/runtime/match/context'
import Planned from '@ts-unify/engine/runtime/match/inner/planned'
import Util from '@ts-unify/engine/runtime/match/inner/util'
import type { Plan } from '@ts-unify/engine/runtime/match/plan'
import type { Bag } from '@ts-unify/engine/runtime/types'
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
      !Util.absorb(
        bag,
        Planned.matchPlan(
          actual[index],
          run.elements[i],
          Context.childCursor(at, index),
        ),
      )
    ) {
      return null
    }
  }

  return bag
}
