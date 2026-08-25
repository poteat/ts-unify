import Atom from '@/atom/atom'
import Slot from '@/atom/slot'

/**
 * A value with no deps; a fresh object per build, so identity shows how
 * many times its read ran.
 */
export type Clock = Slot.Atom<{ readonly now: number }>

/**
 * The slot `clock` fills.
 */
export const Clock = Atom.atom<Clock>('Clock')
