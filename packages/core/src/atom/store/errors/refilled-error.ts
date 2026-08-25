import type { Keyed } from '@/atom/keyed'

import SlotName from './slot-name'

/**
 * The error thrown when a scope is given a definition for a slot its
 * parent fills already.
 *
 * @param slot the slot filled twice
 */
export const refilledError = (slot: Keyed) =>
  new Error(`${SlotName.slotName(slot)} is filled above this scope already`)
