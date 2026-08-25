import { U, $ } from '@ts-unify/core'

import Util from './util'

/**
 * A ternary whose test is an inequality.
 */
export const inequalityTernary = U.ConditionalExpression({
  test: U.BinaryExpression($),
  ...$,
}).when(it => it.operator in Util.flipOp)
