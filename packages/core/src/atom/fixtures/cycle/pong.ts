import Atom from '@/atom/atom'

import Types from './types'

/**
 * Fills `Pong` from the slot whose definition reads it.
 */
export const pong = Atom.atom(Types.Pong, { ping: Types.Ping }, deps => ({
  pongs: deps.ping.pings + 1,
}))
