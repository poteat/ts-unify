import type { Keyed } from '@/atom/keyed'

import SlotName from './slot-name'

/**
 * The error thrown when a slot is read while its own definition is still
 * running, naming the reader and the slot under construction.
 *
 * @param slot the slot still being built
 * @param asker the slot whose definition read it
 */
export const cycleError = (slot: Keyed, asker: Keyed | undefined) =>
  new Error(
    `${SlotName.slotName(asker)} reads ${SlotName.slotName(slot)}, ` +
      'which is still being built',
  )
