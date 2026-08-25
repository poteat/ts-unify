import Atom from '@/atom/atom'
import Slot from '@/atom/slot'

/**
 * One half of a cycle; the other half reads this one.
 */
export type Ping = Slot.Atom<{ readonly pings: number }>

/**
 * The slot `ping` fills.
 */
export const Ping = Atom.atom<Ping>('Ping')
