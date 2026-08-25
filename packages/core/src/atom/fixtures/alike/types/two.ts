import Atom from '@/atom/atom'
import Slot from '@/atom/slot'

/**
 * A shape alike to `One`; the name keeps the two slot types apart.
 */
export type Two = Slot.Atom<{ readonly n: number }, 'Two'>

/**
 * The slot `two` fills.
 */
export const Two = Atom.atom<Two>('Two')
