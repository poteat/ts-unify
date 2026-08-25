import type { Bag, WithFn } from '@ts-unify/runner/types'

/**
 * Apply `with()` callbacks to a bag in chain order, each over the overlays
 * so far, and write the result into the bag in place.
 *
 * In place, so every rewrite site holding that bag, the root `.to()` site
 * included, sees the extra fields.
 *
 * @param bag the match's captures, written to
 * @param withs the rule's `with()` callbacks, in chain order
 */
export function mergeWiths(bag: Bag, withs: readonly WithFn[]) {
  if (withs.length === 0) return
  let overlaid: Bag = bag

  for (const w of withs) overlaid = { ...overlaid, ...w(overlaid) }

  for (const [key, value] of Object.entries(overlaid)) bag[key] = value
}
