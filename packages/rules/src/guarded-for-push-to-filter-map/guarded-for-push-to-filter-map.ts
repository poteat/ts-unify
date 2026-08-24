import { U, $ } from '@ts-unify/core'

// `result.push(value)` as a statement (allow block or bare via maybeBlock)
const pushStatement = U.maybeBlock(
  U.ExpressionStatement({
    expression: U.CallExpression({
      callee: U.MemberExpression({
        object: $('arrayId'),
        property: U.Identifier({ name: 'push' }),
      }),
      arguments: [$('pushValue')],
    }),
  }),
)

// for (const loopVar of source) { if (condition) { result.push(value) } }
const guardedFor = U.ForOfStatement({
  left: U.VariableDeclaration({
    kind: 'const',
    declarations: [U.VariableDeclarator({ id: $('loopVar') })],
  }),
  right: $('source'),
  body: U.maybeBlock(
    U.IfStatement({
      test: $('condition'),
      consequent: pushStatement,
      alternate: null,
    }),
  ),
})

// const result: T = []
const emptyArrayDecl = U.VariableDeclaration({
  kind: 'const',
  declarations: [
    U.VariableDeclarator({
      id: $('arrayId'),
      init: U.ArrayExpression({ elements: [] }),
    }),
  ],
})

/**
 * Transform guarded for-loops with push into filter().map() chains
 *
 * @example
 * ```ts
 * // Before
 * const result: T = [];
 * for (const item of items) {
 *   if (condition(item)) {
 *     result.push(transform(item));
 *   }
 * }
 *
 * // After
 * const result = items
 *   .filter(item => condition(item))
 *   .map(item => transform(item));
 * ```
 */
export const guardedForPushToFilterMap = U.BlockStatement({
  body: [...$('before'), emptyArrayDecl, guardedFor, ...$('after')],
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

                      property: U.Identifier({
                        name: 'filter',
                      }),
                    }),

                    arguments: [
                      U.ArrowFunctionExpression({
                        params: [loopVar],
                        body: condition,
                      }),
                    ],
                  }),

                  property: U.Identifier({
                    name: 'map',
                  }),
                }),

                arguments: [
                  U.ArrowFunctionExpression({
                    params: [loopVar],
                    body: pushValue,
                  }),
                ],
              }),
            }),
          ],
        }),
        ...after,
      ],
    }),
  )
  .message('Replace guarded for-loop with push with filter().map()')
