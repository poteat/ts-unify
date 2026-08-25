import Atom from '@/atom/atom'
import Slot from '@/atom/slot'

/**
 * A second value with no deps.
 */
export type Settings = Slot.Atom<{ readonly name: string }>

/**
 * The slot `settings` fills.
 */
export const Settings = Atom.atom<Settings>('Settings')
