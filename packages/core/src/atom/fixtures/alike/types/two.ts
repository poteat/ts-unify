import Atom from '@/atom/atom'

/**
 * A shape alike to `One`, on a slot of its own.
 */
export type Two = { readonly n: number }

/**
 * The slot `two` fills.
 */
export const Two = Atom.atom<Two>('Two')
