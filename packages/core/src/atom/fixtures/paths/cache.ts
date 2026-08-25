import Atom from '@/atom/atom'

import Types from './types'

/**
 * Fills `Cache` from both paths; a store filling `RepoRoot` alone cannot
 * build it.
 */
export const cache = Atom.atom(
  Types.Cache,
  { repoRoot: Types.RepoRoot, cacheDir: Types.CacheDir },
  deps => ({ dir: `${deps.repoRoot}/${deps.cacheDir}` }),
)
