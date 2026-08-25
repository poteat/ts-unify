import Atom from '@/atom/atom'
import Slot from '@/atom/slot'

/**
 * A value on a slot declared with no label, so error text falls back.
 */
export type Nameless = Slot.Atom<number>

/**
 * A slot with no label and no definition anywhere.
 */
export const Nameless = Atom.atom<Nameless>()
