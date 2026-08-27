import { U, $ } from '@ts-unify/core'

import Bodies from './bodies'

/**
 * A `for (const loopVar of source)` whose block skips on an `if` with
 * no `else` and then pushes onto the array.
 */
export const skippedFor = U.ForOfStatement({
  left: U.VariableDeclaration({
    kind: 'const',
    declarations: [U.VariableDeclarator({ id: $('loopVar') })],
  }),
  right: $('source'),
  body: U.BlockStatement({
    body: [
      U.IfStatement({
        test: $('skipped'),
        consequent: U.maybeBlock(U.ContinueStatement({ label: null })),
        alternate: null,
      }),
      ...$('consts'),
      Bodies.pushStatement,
    ],
  }),
})
