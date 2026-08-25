import Atom from '@/atom/atom'
import Slot from '@/atom/slot'

/**
 * The other half of the cycle.
 */
export type Pong = Slot.Atom<{ readonly pongs: number }>

/**
 * The slot `pong` fills.
 */
export const Pong = Atom.atom<Pong>('Pong')
