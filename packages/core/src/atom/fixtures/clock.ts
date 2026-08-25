import Atom from '@/atom/atom'

import Types from './types'

/**
 * Fills `Clock` from nothing; a fresh object per build.
 */
export const clock = Atom.atom(Types.Clock, () => ({ now: 1 }))
