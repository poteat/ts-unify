import { U } from '@ts-unify/core'

import ElideBracesForReturn from '../elide-braces-for-return'

/**
 * A block of one `return`, its argument `undefined` when it has none;
 * sealed, so the argument takes the name of its position.
 */
export const returnBlock = U.BlockStatement({
  body: [ElideBracesForReturn.anyReturn],
}).seal()
