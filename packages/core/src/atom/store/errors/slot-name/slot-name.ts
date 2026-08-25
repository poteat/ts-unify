import type { Keyed } from '@/atom/keyed'

/**
 * A slot's label for an error message; `get` when the value was asked for
 * from outside, and a stand-in for a slot declared with no label.
 *
 * @param slot the slot, or nothing for the outside caller
 */
export const slotName = (slot: Keyed | undefined) =>
  slot === undefined ? 'get' : (slot.key.description ?? 'an unlabelled atom')
