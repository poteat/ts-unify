import { U, $ } from '@ts-unify/core'

/**
 * A guard on a value and a member read of the same value is an optional
 * member read.
 *
 * @example `obj && obj.prop` becomes `obj?.prop`
 */
export const guardAndAccessToOptionalChain = U.LogicalExpression({
  operator: '&&',
  left: $('obj'),
  right: U.MemberExpression({
    object: $('obj'),
    property: $('prop'),
    computed: false,
    optional: false,
  }),
})
  .to(({ obj, prop }) =>
    U.ChainExpression({
      expression: U.MemberExpression({
        object: obj,
        property: prop,
        computed: false,
        optional: true,
      }),
    }),
  )
  .message('Use optional chaining instead of guard-and-access')
  .recommended()
