import Atom from '@/atom/atom'

import Types from './types'

/**
 * Fills `Handler` from the request and the clock.
 */
export const handler = Atom.atom(
  Types.Handler,
  { request: Types.Request, clock: Types.Clock },
  deps => ({ request: deps.request, clock: deps.clock }),
)
