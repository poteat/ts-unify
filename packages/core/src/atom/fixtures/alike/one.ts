import Atom from '@/atom/atom'

import Types from './types'

/**
 * Fills `One`.
 */
export const one = Atom.atom(Types.One, () => ({ n: 1 }))
