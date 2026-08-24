import { U, $ } from '@ts-unify/core'

/**
 * An `Object.assign` onto an empty literal is an object literal spreading
 * its sources.
 *
 * @example `Object.assign({}, a, b)` becomes `{ ...a, ...b }`
 */
export const objectAssignToSpread = U.CallExpression({
  callee: U.MemberExpression({
    object: U.Identifier({ name: 'Object' }),
    property: U.Identifier({ name: 'assign' }),
    computed: false,
    optional: false,
  }),
  arguments: [U.ObjectExpression({ properties: [] as const }), ...$('sources')],
  optional: false,
})
  .to(it =>
    U.ObjectExpression({
      properties: it.sources.map(src => U.SpreadElement({ argument: src })),
    }),
  )
  .message('Use object spread instead of Object.assign()')
  .recommended()
