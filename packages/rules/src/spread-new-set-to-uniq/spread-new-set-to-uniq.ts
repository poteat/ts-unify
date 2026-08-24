import { U, $, C } from '@ts-unify/core'

/**
 * A spread of a new `Set` over an array is a `uniq` of the array, imported
 * from the configured module.
 *
 * @example `[...new Set(xs)]` becomes `uniq(xs)`
 */
export const spreadNewSetToUniq = U.ArrayExpression({
  elements: [
    U.SpreadElement({
      argument: U.NewExpression({
        callee: U.Identifier({ name: 'Set' }),
        arguments: [$('array')],
      }),
    }),
  ],
})
  .to(it =>
    U.CallExpression({
      callee: U.Identifier({ name: 'uniq' }),
      arguments: [it.array],
    }),
  )
  .imports({ uniq: C('from') })
  .config({ from: 'lodash' })
  .message('Use uniq() instead of [...new Set()]')
