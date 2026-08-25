import Atom from '@/atom/atom'

import Types from './types'

/**
 * Fills `Stamp` from the clock and the settings.
 */
export const stamp = Atom.atom(
  Types.Stamp,
  { clock: Types.Clock, settings: Types.Settings },
  deps => ({
    clock: deps.clock,
    text: `${deps.settings.name}@${deps.clock.now}`,
  }),
)
