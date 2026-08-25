import Atom from '@/atom/atom'

import Types from './types'

/**
 * Fills `RepoRoot` with a plain string.
 */
export const repoRoot = Atom.atom(Types.RepoRoot, () => 'r')
