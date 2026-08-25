import Atom from '@/atom/atom'

/**
 * A value with no deps; a fresh object per build, so identity shows how
 * many times its read ran.
 */
export type Clock = { readonly now: number }

/**
 * The slot `clock` fills.
 */
export const Clock = Atom.atom<Clock>('Clock')
