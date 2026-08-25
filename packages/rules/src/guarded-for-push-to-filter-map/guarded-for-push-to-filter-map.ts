import { U, $ } from '@ts-unify/core'

import Patterns from './patterns'
import Rewrites from './rewrites'

/**
 * An empty array filled by a guarded push inside a `for...of` is one
 * `filter().map()` chain over the source.
 *
 * @example `for (const x of xs) if (p(x)) out.push(f(x))` becomes
 * `const out = xs.filter(x => p(x)).map(x => f(x))`
 */
export const guardedForPushToFilterMap = U.BlockStatement({
  body: [
    ...$('before'),
    Patterns.emptyArrayDecl,
    Patterns.guardedFor,
    ...$('after'),
  ],
})
  .to(({ before, after, arrayId, loopVar, source, condition, pushValue }) =>
    U.BlockStatement({
      body: [
        ...before,
        U.VariableDeclaration({
          kind: 'const',
          declarations: [
            U.VariableDeclarator({
              id: arrayId,
              init: U.CallExpression({
                callee: U.MemberExpression({
                  object: U.CallExpression({
                    callee: U.MemberExpression({
                      object: source,
                      property: U.Identifier({ name: 'filter' }),
                    }),
                    arguments: [Rewrites.arrowFrom(loopVar, condition)],
                  }),
                  property: U.Identifier({ name: 'map' }),
                }),
                arguments: [Rewrites.arrowFrom(loopVar, pushValue)],
              }),
            }),
          ],
        }),
        ...after,
      ],
    }),
  )
  .message('Replace guarded for-loop with push with filter().map()')
