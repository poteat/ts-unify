import Atom from '@/atom/atom'
import Slot from '@/atom/slot'

/**
 * A path, the other slot over `string`; what a store filling `RepoRoot`
 * alone leaves unfilled.
 */
export type CacheDir = Slot.Atom<string, 'CacheDir'>

/**
 * The slot `cacheDir` fills.
 */
export const CacheDir = Atom.atom<CacheDir>('CacheDir')
