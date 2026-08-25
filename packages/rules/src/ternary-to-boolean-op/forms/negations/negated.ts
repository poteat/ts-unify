import { U } from '@ts-unify/core'

import Util from './util'

/**
 * The negation of a boolean-shaped test: an equality flipped, anything
 * else under `!`.
 *
 * @param test the test
 */
export function negated(test: unknown): unknown {
  const n = test as {
    type: string
    operator?: string
    left?: unknown
    right?: unknown
  }

  return n.type === 'BinaryExpression' &&
    n.operator !== undefined &&
    n.operator in Util.FLIPPED
    ? U.BinaryExpression({
        operator: Util.FLIPPED[n.operator as keyof typeof Util.FLIPPED],
        left: n.left as never,
        right: n.right as never,
      })
    : U.UnaryExpression({
        operator: '!',
        prefix: true,
        argument: test as never,
      })
}
