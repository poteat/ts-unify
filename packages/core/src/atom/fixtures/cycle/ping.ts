import Atom from '@/atom/atom'

import Types from './types'

/**
 * Fills `Ping` from the slot whose definition reads it.
 */
export const ping = Atom.atom(Types.Ping, { pong: Types.Pong }, deps => ({
  pings: deps.pong.pongs + 1,
}))
