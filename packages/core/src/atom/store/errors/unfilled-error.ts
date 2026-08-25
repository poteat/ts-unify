import type { Keyed } from '@/atom/keyed'

import SlotName from './slot-name'

/**
 * The error thrown when a slot is read that neither this store nor a
 * parent fills.
 *
 * @param slot the slot read
 * @param asker the slot whose definition read it
 */
export const unfilledError = (slot: Keyed, asker: Keyed | undefined) =>
  new Error(
    `${SlotName.slotName(slot)} is not filled ` +
      `(read by ${SlotName.slotName(asker)})`,
  )
