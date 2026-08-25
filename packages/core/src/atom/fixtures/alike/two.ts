import Atom from '@/atom/atom'

import Types from './types'

/**
 * Fills `Two`, a shape alike to `One`.
 */
export const two = Atom.atom(Types.Two, () => ({ n: 2 }))
