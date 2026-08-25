import { U } from '@ts-unify/core'

import Statements from './statements'

/**
 * A block of one expression statement, captured whole as the body.
 */
export const exprBlock = U.BlockStatement({
  body: [Statements.anyExpressionStatement],
}).bind()
