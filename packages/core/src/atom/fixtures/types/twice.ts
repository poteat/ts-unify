import Atom from '@/atom/atom'

/**
 * A value over the clock alone, left out of most stores.
 */
export type Twice = { readonly at: number }

/**
 * The slot `twice` fills.
 */
export const Twice = Atom.atom<Twice>('Twice')
