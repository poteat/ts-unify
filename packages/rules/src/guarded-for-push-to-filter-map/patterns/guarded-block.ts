import { U, $ } from '@ts-unify/core'

import Decl from './decl'
import Loops from './loops'

/**
 * A block holding the empty array's declaration and then a guarded
 * loop over the source, whatever stands around them captured.
 */
export const guardedBlock = U.BlockStatement({
  body: [...$('before'), Decl.emptyArrayDecl, Loops.guardedFor, ...$('after')],
})
