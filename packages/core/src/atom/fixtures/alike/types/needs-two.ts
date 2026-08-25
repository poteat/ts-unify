import Atom from '@/atom/atom'
import Slot from '@/atom/slot'

/**
 * A value over `Two`, which a store filling `One` alone cannot build.
 */
export type NeedsTwo = Slot.Atom<{ readonly doubled: number }>

/**
 * The slot `needsTwo` fills.
 */
export const NeedsTwo = Atom.atom<NeedsTwo>('NeedsTwo')
