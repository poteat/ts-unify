import type { Bag } from '../bag'

/**
 * Adds the captures of one part of a match to the bag; false when that
 * part did not match, so the caller fails the whole.
 *
 * @param bag the captures so far, extended in place
 * @param part the part's captures, or null where it did not match
 */
export function absorb(bag: Bag, part: Bag | null): boolean {
  if (!part) return false
  Object.assign(bag, part)

  return true
}
