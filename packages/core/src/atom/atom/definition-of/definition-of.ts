import type { Deps } from '@/atom/deps'
import type { Filling } from '@/atom/filling'
import type { Keyed } from '@/atom/keyed'
import type { Reader } from '@/atom/reader'

/**
 * A definition as the store holds it; the three-argument form of `atom`,
 * and the two-argument form with no deps.
 *
 * @param slot the slot filled
 * @param deps the slots read, by name
 * @param read the function over their values
 */
export const definitionOf = (
  slot: Keyed,
  deps: Deps,
  read: Reader,
): Filling => ({ slot, deps, read })
