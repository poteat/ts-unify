import Atom from '@/atom/atom'
import Slot from '@/atom/slot'

/**
 * A shape alike to `Two`; the name keeps the two slot types apart.
 */
export type One = Slot.Atom<{ readonly n: number }, 'One'>

/**
 * The slot `one` fills.
 */
export const One = Atom.atom<One>('One')
