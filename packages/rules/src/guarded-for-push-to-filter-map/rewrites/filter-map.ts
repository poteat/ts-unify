import { U } from '@ts-unify/core'

import Callback from './callback'
import type { Loop } from './types'

/**
 * The block with the loop replaced by `const arrayName = source
 * .filter(loopVar => test).map(loopVar => pushValue)`.
 *
 * @param loop the captures of the array and the loop over it
 * @returns the `BlockStatement` with the chain in the loop's place
 */
export const filterMap = (loop: Loop) =>
  U.BlockStatement({
    body: [
      ...loop.before,
      U.VariableDeclaration({
        kind: 'const',
        declarations: [
          U.VariableDeclarator({
            id: U.Identifier({ name: loop.arrayName }),
            init: U.CallExpression({
              callee: U.MemberExpression({
                object: U.CallExpression({
                  callee: U.MemberExpression({
                    object: loop.source,
                    property: U.Identifier({ name: 'filter' }),
                  }),
                  arguments: [Callback.arrowFrom(loop.loopVar, loop.test)],
                }),
                property: U.Identifier({ name: 'map' }),
              }),
              arguments: [
                Callback.kept(loop.loopVar, loop.consts, loop.pushValue),
              ],
            }),
          }),
        ],
      }),
      ...loop.after,
    ],
  })
