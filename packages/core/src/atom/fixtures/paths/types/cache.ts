import Atom from '@/atom/atom'
import Slot from '@/atom/slot'

/**
 * A value over both paths.
 */
export type Cache = Slot.Atom<{ readonly dir: string }>

/**
 * The slot `cache` fills.
 */
export const Cache = Atom.atom<Cache>('Cache')
