import type { Bag } from '../bag'
import Context from '../context'
import { matchValueInner } from './match-value-inner'

/**
 * Matches a run of pattern elements against the array elements from an
 * index on, and returns their merged captures.
 *
 * Null at the first element that does not match.
 *
 * @param actual the array
 * @param run the pattern elements and the array index the first aligns to
 * @param at where the array sits in the match
 */
export function matchRun(
  actual: unknown[],
  run: { elements: unknown[]; start: number },
  at: Context.Cursor,
): Bag | null {
  const bag: Bag = {}

  for (const [i, element] of run.elements.entries()) {
    const index = run.start + i
    const elemBag = matchValueInner(
      actual[index],
      element,
      Context.childCursor(at, index),
    )
    if (!elemBag) return null
    Object.assign(bag, elemBag)
  }

  return bag
}
