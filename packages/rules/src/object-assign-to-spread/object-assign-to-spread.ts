import { U, $ } from '@ts-unify/core'
import Patterns from '@ts-unify/rules/patterns'

/**
 * An `Object.assign` onto an empty literal is an object literal spreading
 * its sources.
 *
 * @example `Object.assign({}, a, b)` becomes `{ ...a, ...b }`
 */
export const objectAssignToSpread = U.CallExpression({
  callee: Patterns.staticMember('Object', 'assign'),
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
