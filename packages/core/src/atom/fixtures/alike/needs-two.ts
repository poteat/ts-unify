import Atom from '@/atom/atom'

import Types from './types'

/**
 * Fills `NeedsTwo` from `Two`; a store filling `One` alone does not
 * satisfy it at runtime, though the checker sees one type.
 */
export const needsTwo = Atom.atom(Types.NeedsTwo, { two: Types.Two }, deps => ({
  doubled: deps.two.n * 2,
}))
