import Atom from '@/atom/atom'

/**
 * The other half of the cycle.
 */
export type Pong = { readonly pongs: number }

/**
 * The slot `pong` fills.
 */
export const Pong = Atom.atom<Pong>('Pong')
