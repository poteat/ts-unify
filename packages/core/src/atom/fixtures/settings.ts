import Atom from '@/atom/atom'

import Types from './types'

/**
 * Fills `Settings` from nothing.
 */
export const settings = Atom.atom(Types.Settings, () => ({ name: 'atom' }))
