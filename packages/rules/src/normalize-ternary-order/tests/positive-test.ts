import { U } from '@ts-unify/core'

import type { TernaryTest } from './types'
import Util from './util'

/**
 * The test with its negation gone: the operand of the `!`, or the
 * comparison with its operator flipped to the equality.
 *
 * @param bag what the matched ternary captured from its test
 * @returns the condition under the `!`, or a `BinaryExpression` with the
 *          flipped operator
 */
export function positiveTest(bag: TernaryTest) {
  const isNegation = 'condition' in bag

  return isNegation
    ? bag.condition
    : U.BinaryExpression({
        operator: Util.flipOp[bag.operator as keyof typeof Util.flipOp],
        left: bag.left,
        right: bag.right,
      })
}
