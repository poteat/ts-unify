import { U, $ } from '@ts-unify/core'

import Statement from './statement'

/**
 * A block ending in the push, after the consts the callback keeps.
 */
export const pushingBlock = U.BlockStatement({
  body: [...$('consts'), Statement.pushStatement],
})
