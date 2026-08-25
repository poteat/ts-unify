import Atom from '@/atom/atom'
import Slot from '@/atom/slot'

/**
 * A value over the clock alone, left out of most stores.
 */
export type Twice = Slot.Atom<{ readonly at: number }>

/**
 * The slot `twice` fills.
 */
export const Twice = Atom.atom<Twice>('Twice')
