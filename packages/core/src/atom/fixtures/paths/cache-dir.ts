import Atom from '@/atom/atom'

import Types from './types'

/**
 * Fills `CacheDir`, the slot alike to `RepoRoot`, with a plain string.
 */
export const cacheDir = Atom.atom(Types.CacheDir, () => 'c')
