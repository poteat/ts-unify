import { U, $ } from '@ts-unify/core'

import Patterns from './patterns'

/**
 * A `map` over `Array.from(x)` is the second argument of `Array.from`.
 *
 * @example `Array.from(xs).map(f)` becomes `Array.from(xs, f)`
 */
export const arrayFromMapToArrayFrom = U.CallExpression({
  callee: U.MemberExpression({
    object: U.CallExpression({
      callee: Patterns.arrayFrom,
      arguments: [$('iterable')],
      optional: false,
    }),
    property: U.Identifier({ name: 'map' }),
    computed: false,
    optional: false,
  }),
  arguments: [$('mapFn')],
  optional: false,
})
  .to(({ iterable, mapFn }) =>
    U.CallExpression({
      callee: Patterns.arrayFrom,
      arguments: [iterable, mapFn],
      optional: false,
    }),
  )
  .message('Collapse Array.from().map() into Array.from(_, mapFn)')
  .recommended()
