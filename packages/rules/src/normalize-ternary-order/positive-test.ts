import { U } from '@ts-unify/core'

import { flipOp } from './flip-op'
import type { TernaryTest } from './ternary-test'

/**
 * The test with its negation gone: the operand of the `!`, or the
 * comparison with its operator flipped to the equality.
 *
 * @param bag what the matched ternary captured from its test
 */
export const positiveTest = (bag: TernaryTest) =>
  'condition' in bag
    ? bag.condition
    : U.BinaryExpression({
        operator: flipOp[bag.operator as keyof typeof flipOp],
        left: bag.left,
        right: bag.right,
      })
