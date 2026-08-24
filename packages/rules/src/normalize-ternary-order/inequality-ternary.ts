import { U, $ } from '@ts-unify/core'

import { flipOp } from './flip-op'

/**
 * A ternary whose test is an inequality.
 */
export const inequalityTernary = U.ConditionalExpression({
  test: U.BinaryExpression($),
  ...$,
}).when(it => it.operator in flipOp)
