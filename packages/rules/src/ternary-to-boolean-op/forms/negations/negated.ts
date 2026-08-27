import { U } from '@ts-unify/core'
import type Types from '@ts-unify/rules/ternary-to-boolean-op/forms/types'

import Util from './util'

/**
 * The negation of a ternary's boolean-shaped test: an equality flipped,
 * anything else under `!`.
 *
 * @param bag the ternary's test and two arms
 * @returns a `BinaryExpression` with the flipped operator, or the test under a
 *          `!`
 */
export function negated(bag: Types.Ternary): unknown {
  const n = bag.test as Types.Test

  const isFlippableBinary =
    n.type === 'BinaryExpression' &&
    n.operator !== undefined &&
    n.operator in Util.FLIPPED

  return isFlippableBinary
    ? U.BinaryExpression({
        operator: Util.FLIPPED[n.operator as keyof typeof Util.FLIPPED],
        left: n.left as never,
        right: n.right as never,
      })
    : U.UnaryExpression({
        operator: '!',
        prefix: true,
        argument: bag.test as never,
      })
}
