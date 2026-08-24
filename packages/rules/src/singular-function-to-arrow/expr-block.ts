import { U } from '@ts-unify/core'

import { anyExpressionStatement } from './any-expression-statement'

/**
 * A block of one expression statement, captured whole as the body.
 */
export const exprBlock = U.BlockStatement({
  body: [anyExpressionStatement],
}).bind()
