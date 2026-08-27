import { U, $ } from '@ts-unify/core'

import Bodies from './bodies'

/**
 * A `for (const loopVar of source)` whose body is one `if` with no
 * `else`, guarding a push onto the array, bare or last in its block.
 */
export const guardedFor = U.ForOfStatement({
  left: U.VariableDeclaration({
    kind: 'const',
    declarations: [U.VariableDeclarator({ id: $('loopVar') })],
  }),
  right: $('source'),
  body: U.maybeBlock(
    U.IfStatement({
      test: $('condition'),
      consequent: U.or(Bodies.pushStatement, Bodies.pushingBlock),
      alternate: null,
    }),
  ),
})
