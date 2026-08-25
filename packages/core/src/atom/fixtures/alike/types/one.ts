import Atom from '@/atom/atom'

/**
 * A shape alike to `Two`, on a slot of its own.
 */
export type One = { readonly n: number }

/**
 * The slot `one` fills.
 */
export const One = Atom.atom<One>('One')
