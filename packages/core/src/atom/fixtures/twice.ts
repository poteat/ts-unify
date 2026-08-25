import Atom from '@/atom/atom'

import Types from './types'

/**
 * Fills `Twice` from the clock alone.
 */
export const twice = Atom.atom(Types.Twice, { clock: Types.Clock }, deps => ({
  at: deps.clock.now * 2,
}))
