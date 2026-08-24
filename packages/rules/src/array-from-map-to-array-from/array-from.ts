import { U } from '@ts-unify/core'

/**
 * The callee `Array.from`, as a pattern to match and as a node to build.
 */
export const arrayFrom = U.MemberExpression({
  object: U.Identifier({ name: 'Array' }),
  property: U.Identifier({ name: 'from' }),
  computed: false,
  optional: false,
})
