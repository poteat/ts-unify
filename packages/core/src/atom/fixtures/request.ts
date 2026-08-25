import Atom from '@/atom/atom'

import Types from './types'

/**
 * Fills `Request` from nothing; a fresh object per scope.
 */
export const request = Atom.atom(Types.Request, () => ({ id: 'request' }))
