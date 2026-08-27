import { U } from '@ts-unify/core'

import Booleans from './booleans'
import Negations from './negations'
import type Types from './types'

/**
 * The operator form a ternary with a boolean literal arm stands for, or
 * null when it has none.
 *
 * `c ? true : r` is `c || r`, `c ? r : false` is `c && r`, `c ? false : r`
 * is `!c && r`, `c ? true : false` is `c`, `c ? false : true` is `!c`.
 *
 * @param bag the ternary's test and two arms
 * @returns the test, its negation or a `LogicalExpression`; null when no form
 *          fits
 */
export function form(bag: Types.Ternary): unknown {
  const { test, consequent, alternate } = bag
  const consequentLiteral = Booleans.literalBoolean(consequent)
  const alternateLiteral = Booleans.literalBoolean(alternate)
  const standsForTest =
    (consequentLiteral ?? false) && alternateLiteral === false
  const standsForNegation =
    consequentLiteral === false && (alternateLiteral ?? false)
  const standsForOr = consequentLiteral ?? false
  const standsForAnd =
    alternateLiteral === false && !Booleans.isLiteral(consequent)
  const standsForNegatedAnd =
    consequentLiteral === false && !Booleans.isLiteral(alternate)

  return !Booleans.booleanShaped(test)
    ? null
    : standsForTest
      ? test
      : standsForNegation
        ? Negations.negated(bag)
        : standsForOr
          ? U.LogicalExpression({
              operator: '||',
              left: test as never,
              right: alternate as never,
            })
          : standsForAnd
            ? U.LogicalExpression({
                operator: '&&',
                left: test as never,
                right: consequent as never,
              })
            : standsForNegatedAnd
              ? U.LogicalExpression({
                  operator: '&&',
                  left: Negations.negated(bag) as never,
                  right: alternate as never,
                })
              : null
}
