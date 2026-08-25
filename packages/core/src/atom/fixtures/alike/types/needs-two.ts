import Atom from '@/atom/atom'

/**
 * A value over `Two`, which a store filling `One` alone cannot build.
 */
export type NeedsTwo = { readonly doubled: number }

/**
 * The slot `needsTwo` fills.
 */
export const NeedsTwo = Atom.atom<NeedsTwo>('NeedsTwo')
