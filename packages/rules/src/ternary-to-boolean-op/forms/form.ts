import { U } from '@ts-unify/core'

import Booleans from './booleans'
import Negations from './negations'

/**
 * The operator form a ternary with a boolean literal arm stands for, or
 * null when it has none.
 *
 * `c ? true : r` is `c || r`, `c ? r : false` is `c && r`, `c ? false : r`
 * is `!c && r`, `c ? true : false` is `c`, `c ? false : true` is `!c`.
 *
 * @param bag the ternary's test and two arms
 */
export function form(bag: {
  test?: unknown
  consequent?: unknown
  alternate?: unknown
}): unknown {
  const { test, consequent, alternate } = bag
  const consequentLiteral = Booleans.literalBoolean(consequent)
  const alternateLiteral = Booleans.literalBoolean(alternate)

  return !Booleans.booleanShaped(test)
    ? null
    : consequentLiteral === true && alternateLiteral === false
      ? test
      : consequentLiteral === false && alternateLiteral === true
        ? Negations.negated(test)
        : consequentLiteral === true
          ? U.LogicalExpression({
              operator: '||',
              left: test as never,
              right: alternate as never,
            })
          : alternateLiteral === false && !Booleans.isLiteral(consequent)
            ? U.LogicalExpression({
                operator: '&&',
                left: test as never,
                right: consequent as never,
              })
            : consequentLiteral === false && !Booleans.isLiteral(alternate)
              ? U.LogicalExpression({
                  operator: '&&',
                  left: Negations.negated(test) as never,
                  right: alternate as never,
                })
              : null
}
