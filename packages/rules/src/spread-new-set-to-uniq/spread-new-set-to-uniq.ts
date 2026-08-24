import { U, $, C } from '@ts-unify/core'

/**
 * Replace [...new Set(array)] with uniq(array)
 *
 * @example
 * ```ts
 * // Before
 * [...new Set(myArray)]
 *
 * // After
 * uniq(myArray)
 * ```
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
