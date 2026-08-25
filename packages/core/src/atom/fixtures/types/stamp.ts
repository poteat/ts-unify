import Atom from '@/atom/atom'
import Slot from '@/atom/slot'
import type { ValueOf } from '@/atom/value-of'

import type { Clock } from './clock'

/**
 * A value over two others; it keeps the clock it was handed, so a test
 * can check it is the one the store holds.
 */
export type Stamp = Slot.Atom<{
  readonly clock: ValueOf<Clock>
  readonly text: string
}>

/**
 * The slot `stamp` fills.
 */
export const Stamp = Atom.atom<Stamp>('Stamp')
