import Atom from '@/atom/atom'

/**
 * One half of a cycle; the other half reads this one.
 */
export type Ping = { readonly pings: number }

/**
 * The slot `ping` fills.
 */
export const Ping = Atom.atom<Ping>('Ping')
