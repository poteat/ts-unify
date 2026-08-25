import SlotOf from '@/atom/atom/slot-of'
import type { Deps } from '@/atom/deps'

import type { Named } from './named'

/**
 * A vocabulary declared at once: a table of unnamed slots, each coming
 * out named by its key, the key its label too.
 *
 * Each entry is a fresh slot; the ones written in the table are not the
 * ones returned, so an entry is written inline, never held elsewhere.
 *
 * @param table the slots, by the names they take
 */
export const atoms = <const T extends Deps>(table: T): Named<T> =>
  Object.fromEntries(
    Object.keys(table).map(name => [name, SlotOf.slotOf(name)]),
  ) as Named<T>
