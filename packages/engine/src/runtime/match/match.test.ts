import { U, NODE, $, C } from '@ts-unify/core/internal'

import { match } from './match'

function extractFirstPattern(proxy: any) {
  const node = proxy[NODE]

  return { tag: node.tag, pattern: node.args[0] ?? {}, chain: node.chain }
}

// Suppress "unused" warnings for destructured bindings used only for assertion
/* eslint-disable @typescript-eslint/no-unused-vars */

describe('match - seal', () => {
  it('re-keys a single inner capture to the parent property name', () => {
    const bag = match(
      {
        type: 'IfStatement',

        test: {
          type: 'Identifier',
          name: 'cond',
        },

        consequent: {
          type: 'ReturnStatement',

          argument: {
            type: 'Literal',
            value: 42,
          },
        },
      },
      {
        test: $,

        consequent: (U as any)
          .ReturnStatement({
            argument: $,
          })
          .seal(),
      },
    )

    expect(bag).not.toBeNull()

    expect(bag!.consequent).toEqual({
      type: 'Literal',
      value: 42,
    })

    expect(bag!.argument).toBeUndefined()

    expect(bag!.test).toEqual({
      type: 'Identifier',
      name: 'cond',
    })
  })

  it('passes through empty bag when seal has zero captures', () => {
    const bag = match(
      {
        type: 'SomeNode',

        value: {
          type: 'Identifier',
          name: 'foo',
        },
      },
      {
        value: (U as any)
          .Identifier({
            name: 'foo',
          })
          .seal(),
      },
    )

    expect(bag).not.toBeNull()
    expect(Object.keys(bag!)).toHaveLength(0)
  })

  it('works with maybeBlock + seal (if-return-to-ternary pattern)', () => {
    const anyReturnForm = (U as any)
      .maybeBlock(
        (U as any).ReturnStatement({
          argument: $,
        }),
      )
      .seal()

    const pattern = {
      test: $,
      consequent: anyReturnForm,
      alternate: anyReturnForm,
    }

    const bag1 = match(
      {
        type: 'IfStatement',

        test: {
          type: 'Identifier',
          name: 'cond',
        },

        consequent: {
          type: 'BlockStatement',

          body: [
            {
              type: 'ReturnStatement',

              argument: {
                type: 'Literal',
                value: 1,
              },
            },
          ],
        },

        alternate: {
          type: 'BlockStatement',

          body: [
            {
              type: 'ReturnStatement',

              argument: {
                type: 'Literal',
                value: 2,
              },
            },
          ],
        },
      },
      pattern,
    )

    expect(bag1).not.toBeNull()

    expect(bag1!.consequent).toEqual({
      type: 'Literal',
      value: 1,
    })

    expect(bag1!.alternate).toEqual({
      type: 'Literal',
      value: 2,
    })

    expect(bag1!.test).toEqual({
      type: 'Identifier',
      name: 'cond',
    })

    const bag2 = match(
      {
        type: 'IfStatement',

        test: {
          type: 'Identifier',
          name: 'x',
        },

        consequent: {
          type: 'ReturnStatement',

          argument: {
            type: 'Identifier',
            name: 'a',
          },
        },

        alternate: {
          type: 'ReturnStatement',

          argument: {
            type: 'Identifier',
            name: 'b',
          },
        },
      },
      pattern,
    )

    expect(bag2).not.toBeNull()

    expect(bag2!.consequent).toEqual({
      type: 'Identifier',
      name: 'a',
    })

    expect(bag2!.alternate).toEqual({
      type: 'Identifier',
      name: 'b',
    })
  })
})

describe('match - bind', () => {
  it('zero-arg bind() embedded under a property re-keys to that property', () => {
    const exprBlock = (U as any)
      .BlockStatement({
        body: [
          (U as any).ExpressionStatement({
            expression: $,
          }),
        ],
      })
      .bind()

    const ast = {
      type: 'BlockStatement',

      body: [
        {
          type: 'ExpressionStatement',

          expression: {
            type: 'Identifier',
            name: 'x',
          },
        },
      ],
    }

    expect(extractFirstPattern(exprBlock).tag).toBe('BlockStatement')

    const bag = match(
      {
        type: 'SomeNode',
        body: ast,
      },
      {
        body: exprBlock,
      },
    )

    expect(bag).not.toBeNull()
    expect(bag!.body).toBe(ast)
    expect(bag!.node).toBeUndefined()
    expect(bag!.expression).toBeUndefined()
  })

  it("captures the whole node under a custom name with bind('name')", () => {
    const namedBind = (U as any)
      .BlockStatement({
        body: [
          (U as any).ExpressionStatement({
            expression: $,
          }),
        ],
      })
      .bind('myBlock')

    const ast = {
      type: 'BlockStatement',

      body: [
        {
          type: 'ExpressionStatement',

          expression: {
            type: 'Literal',
            value: 42,
          },
        },
      ],
    }

    const bag = match(
      {
        type: 'SomeNode',
        body: ast,
      },
      {
        body: namedBind,
      },
    )

    expect(bag).not.toBeNull()
    expect(bag!.myBlock).toBe(ast)
    expect(bag!.expression).toBeUndefined()
  })

  it('still validates structure before binding', () => {
    expect(
      match(
        {
          type: 'SomeNode',

          body: {
            type: 'BlockStatement',

            body: [
              {
                type: 'ThrowStatement',
              },
            ],
          },
        },
        {
          body: (U as any)
            .BlockStatement({
              body: [
                (U as any).ReturnStatement({
                  argument: $,
                }),
              ],
            })
            .bind('result'),
        },
      ),
    ).toBeNull()
  })
})

describe('match - defaultUndefined', () => {
  it('is a type-level-only modifier ($ already captures null)', () => {
    const bag = match(
      {
        type: 'SomeNode',

        stmt: {
          type: 'ReturnStatement',
          argument: null,
        },
      },
      {
        stmt: (U as any)
          .ReturnStatement({
            argument: $,
          })
          .defaultUndefined(),
      },
    )

    expect(bag).not.toBeNull()
    expect(bag!.argument).toBeNull()
  })

  it('works with seal (captures null, re-keyed)', () => {
    const bag = match(
      {
        type: 'SomeNode',

        stmt: {
          type: 'ReturnStatement',
          argument: null,
        },
      },
      {
        stmt: (U as any)
          .ReturnStatement({
            argument: $,
          })
          .defaultUndefined()
          .seal(),
      },
    )

    expect(bag).not.toBeNull()
    expect(bag!.stmt).toBeNull()
    expect(bag!.argument).toBeUndefined()
  })

  it('does NOT make the proxy match when the actual node is null', () => {
    expect(
      match(
        {
          type: 'IfStatement',
          alternate: null,
        },
        {
          alternate: (U as any)
            .maybeBlock(
              (U as any).ReturnStatement({
                argument: $,
              }),
            )
            .defaultUndefined()
            .seal(),
        },
      ),
    ).toBeNull()
  })
})

describe('match - config slots (C)', () => {
  it('matches a config slot value against the config default', () => {
    expect(
      match(
        {
          type: 'CallExpression',

          callee: {
            type: 'Identifier',
            name: 'uniq',
          },
        },
        {
          callee: {
            type: 'Identifier',
            name: C('fn'),
          },
        },
        [
          {
            method: 'config',

            args: [
              {
                fn: 'uniq',
              },
            ],
          },
        ],
      ),
    ).not.toBeNull()
  })

  it("rejects when config slot value doesn't match", () => {
    expect(
      match(
        {
          type: 'CallExpression',

          callee: {
            type: 'Identifier',
            name: 'map',
          },
        },
        {
          callee: {
            type: 'Identifier',
            name: C('fn'),
          },
        },
        [
          {
            method: 'config',

            args: [
              {
                fn: 'uniq',
              },
            ],
          },
        ],
      ),
    ).toBeNull()
  })

  it('works with config slots in arrays', () => {
    expect(
      match(
        {
          type: 'ArrayExpression',
          elements: ['hello'],
        },
        {
          elements: [C('val')],
        },
        [
          {
            method: 'config',

            args: [
              {
                val: 'hello',
              },
            ],
          },
        ],
      ),
    ).not.toBeNull()
  })

  it('rejects with missing config defaults', () => {
    const pattern = {
      name: C('fn'),
    }

    const chain: {
      method: string
      args: any[]
    }[] = []

    expect(
      match(
        {
          type: 'Identifier',
          name: 'foo',
        },
        pattern,
        chain,
      ),
    ).toBeNull()
  })
})

describe('match - combined seal + bind + or', () => {
  it(
    'handles the singular-function-to-arrow pattern (or with seal and bind ' +
      'branches)',
    () => {
      const orPattern = (U as any).or(
        (U as any)
          .BlockStatement({
            body: [
              (U as any)
                .ReturnStatement({
                  argument: $,
                })
                .defaultUndefined(),
            ],
          })
          .seal(),
        (U as any)
          .BlockStatement({
            body: [
              (U as any).ExpressionStatement({
                expression: $,
              }),
            ],
          })
          .bind(),
      )

      const bag1 = match(
        {
          type: 'SomeNode',

          body: {
            type: 'BlockStatement',

            body: [
              {
                type: 'ReturnStatement',

                argument: {
                  type: 'Literal',
                  value: 42,
                },
              },
            ],
          },
        },
        {
          body: orPattern,
        },
      )

      expect(bag1).not.toBeNull()

      expect(bag1!.body).toEqual({
        type: 'Literal',
        value: 42,
      })

      const exprAst = {
        type: 'BlockStatement',

        body: [
          {
            type: 'ExpressionStatement',

            expression: {
              type: 'Identifier',
              name: 'doStuff',
            },
          },
        ],
      }

      const bag2 = match(
        {
          type: 'SomeNode',
          body: exprAst,
        },
        {
          body: orPattern,
        },
      )

      expect(bag2).not.toBeNull()
      expect(bag2!.body).toBe(exprAst)
      expect(bag2!.node).toBeUndefined()
    },
  )
})

describe('match - where + none', () => {
  // Helper: build a chain with a where entry from patterns that carry .none().
  const whereChain = (
    ...patterns: unknown[]
  ): {
    method: string
    args: unknown[]
  }[] => [
    {
      method: 'where',
      args: patterns,
    },
  ]

  it('rejects when pattern appears in subtree (.none())', () => {
    expect(
      match(
        {
          type: 'FunctionDeclaration',
          name: 'f',

          body: {
            type: 'BlockStatement',

            body: [
              {
                type: 'ReturnStatement',

                argument: {
                  type: 'ThisExpression',
                },
              },
            ],
          },
        },
        {
          name: $,
        },
        whereChain((U as any).ThisExpression().none()),
      ),
    ).toBeNull()
  })

  it('accepts when pattern is absent (.none())', () => {
    const bag = match(
      {
        type: 'FunctionDeclaration',
        name: 'f',

        body: {
          type: 'BlockStatement',

          body: [
            {
              type: 'ReturnStatement',

              argument: {
                type: 'Literal',
                value: 1,
              },
            },
          ],
        },
      },
      {
        name: $,
      },
      whereChain((U as any).ThisExpression().none()),
    )

    expect(bag).not.toBeNull()
    expect(bag!.name).toBe('f')
  })

  it(
    'respects .until() boundary — does not reject when pattern is behind ' +
      'boundary',
    () => {
      const bag = match(
        {
          type: 'FunctionDeclaration',
          name: 'outer',

          body: {
            type: 'BlockStatement',

            body: [
              {
                type: 'ReturnStatement',

                argument: {
                  type: 'FunctionExpression',

                  body: {
                    type: 'BlockStatement',

                    body: [
                      {
                        type: 'ReturnStatement',

                        argument: {
                          type: 'ThisExpression',
                        },
                      },
                    ],
                  },
                },
              },
            ],
          },
        },
        {
          name: $,
        },
        whereChain(
          (U as any)
            .ThisExpression()
            .until((U as any).FunctionExpression())
            .none(),
        ),
      )

      expect(bag).not.toBeNull()
      expect(bag!.name).toBe('outer')
    },
  )

  it('rejects when pattern is BEFORE the boundary', () => {
    expect(
      match(
        {
          type: 'FunctionDeclaration',
          name: 'f',

          body: {
            type: 'BlockStatement',

            body: [
              {
                type: 'ExpressionStatement',

                expression: {
                  type: 'ThisExpression',
                },
              },
            ],
          },
        },
        {
          name: $,
        },
        whereChain(
          (U as any)
            .ThisExpression()
            .until((U as any).FunctionExpression())
            .none(),
        ),
      ),
    ).toBeNull()
  })

  it('boundary node itself is checked against the pattern before pruning', () => {
    expect(
      match(
        {
          type: 'FunctionDeclaration',
          name: 'f',

          body: {
            type: 'BlockStatement',

            body: [
              {
                type: 'ExpressionStatement',

                expression: {
                  type: 'FunctionExpression',

                  body: {
                    type: 'BlockStatement',
                    body: [],
                  },
                },
              },
            ],
          },
        },
        {
          name: $,
        },
        whereChain(
          (U as any)
            .FunctionExpression()
            .until((U as any).FunctionExpression())
            .none(),
        ),
      ),
    ).toBeNull()
  })

  it('handles U.or() boundary with multiple types', () => {
    expect(
      match(
        {
          type: 'Program',
          name: 'p',

          body: [
            {
              type: 'FunctionDeclaration',

              body: {
                type: 'BlockStatement',

                body: [
                  {
                    type: 'ReturnStatement',

                    argument: {
                      type: 'ThisExpression',
                    },
                  },
                ],
              },
            },
          ],
        },
        {
          name: $,
        },
        whereChain(
          (U as any)
            .ThisExpression()
            .until(
              (U as any).or(
                (U as any).FunctionDeclaration(),
                (U as any).FunctionExpression(),
              ),
            )
            .none(),
        ),
      ),
    ).not.toBeNull()
  })

  it('multiple .where() entries compose (all must pass)', () => {
    expect(
      match(
        {
          type: 'FunctionDeclaration',
          name: 'f',

          body: {
            type: 'BlockStatement',

            body: [
              {
                type: 'ReturnStatement',

                argument: {
                  type: 'Identifier',
                  name: 'arguments',
                },
              },
            ],
          },
        },
        {
          name: $,
        },
        [
          {
            method: 'where',
            args: [(U as any).ThisExpression().none()],
          },
          {
            method: 'where',

            args: [
              (U as any)
                .Identifier({
                  name: 'arguments',
                })
                .none(),
            ],
          },
        ],
      ),
    ).toBeNull()
  })

  it('structural inner pattern (not just type)', () => {
    expect(
      match(
        {
          type: 'FunctionDeclaration',
          name: 'f',

          body: {
            type: 'BlockStatement',

            body: [
              {
                type: 'ReturnStatement',

                argument: {
                  type: 'Identifier',
                  name: 'x',
                },
              },
            ],
          },
        },
        {
          name: $,
        },
        whereChain(
          (U as any)
            .Identifier({
              name: 'arguments',
            })
            .none(),
        ),
      ),
    ).not.toBeNull()
  })

  it('checks default parameter values (not just body)', () => {
    expect(
      match(
        {
          type: 'FunctionDeclaration',
          name: 'f',

          params: [
            {
              type: 'AssignmentPattern',

              left: {
                type: 'Identifier',
                name: 'x',
              },

              right: {
                type: 'MemberExpression',

                object: {
                  type: 'ThisExpression',
                },

                property: {
                  type: 'Identifier',
                  name: 'foo',
                },
              },
            },
          ],

          body: {
            type: 'BlockStatement',

            body: [
              {
                type: 'ReturnStatement',

                argument: {
                  type: 'Identifier',
                  name: 'x',
                },
              },
            ],
          },
        },
        {
          name: $,
        },
        whereChain(
          (U as any)
            .ThisExpression()
            .until((U as any).FunctionExpression())
            .none(),
        ),
      ),
    ).toBeNull()
  })

  it('handles U.or() in the excluded pattern', () => {
    const pattern = {
      name: $,
    }

    const chain = whereChain(
      (U as any)
        .or(
          (U as any).ThisExpression(),
          (U as any).Identifier({
            name: 'arguments',
          }),
        )
        .until((U as any).FunctionExpression())
        .none(),
    )

    expect(
      match(
        {
          type: 'FunctionDeclaration',
          name: 'f',

          body: {
            type: 'BlockStatement',

            body: [
              {
                type: 'ReturnStatement',

                argument: {
                  type: 'ThisExpression',
                },
              },
            ],
          },
        },
        pattern,
        chain,
      ),
    ).toBeNull()

    expect(
      match(
        {
          type: 'FunctionDeclaration',
          name: 'f',

          body: {
            type: 'BlockStatement',

            body: [
              {
                type: 'ReturnStatement',

                argument: {
                  type: 'Identifier',
                  name: 'arguments',
                },
              },
            ],
          },
        },
        pattern,
        chain,
      ),
    ).toBeNull()

    expect(
      match(
        {
          type: 'FunctionDeclaration',
          name: 'f',

          body: {
            type: 'BlockStatement',

            body: [
              {
                type: 'ReturnStatement',

                argument: {
                  type: 'Literal',
                  value: 1,
                },
              },
            ],
          },
        },
        pattern,
        chain,
      ),
    ).not.toBeNull()

    expect(
      match(
        {
          type: 'FunctionDeclaration',
          name: 'f',

          body: {
            type: 'BlockStatement',

            body: [
              {
                type: 'ReturnStatement',

                argument: {
                  type: 'FunctionExpression',

                  body: {
                    type: 'BlockStatement',

                    body: [
                      {
                        type: 'ReturnStatement',

                        argument: {
                          type: 'ThisExpression',
                        },
                      },
                    ],
                  },
                },
              },
            ],
          },
        },
        pattern,
        chain,
      ),
    ).not.toBeNull()
  })
})

describe('match - where + quantifiers (some, atLeast, atMost, exactly)', () => {
  // AST with 3 ReturnStatements
  const ast = {
    type: 'Program',
    name: 'p',
    body: [
      { type: 'ReturnStatement', argument: { type: 'Literal', value: 1 } },
      { type: 'ReturnStatement', argument: { type: 'Literal', value: 2 } },
      { type: 'ReturnStatement', argument: { type: 'Literal', value: 3 } },
      {
        type: 'ExpressionStatement',
        expression: { type: 'Literal', value: 4 },
      },
    ],
  }
  const pattern = { name: $ }

  it('.some() accepts when at least one match exists', () => {
    expect(
      match(ast, pattern, [
        {
          method: 'where',
          args: [(U as any).ReturnStatement().some()],
        },
      ]),
    ).not.toBeNull()
  })

  it('.some() rejects when zero matches', () => {
    expect(
      match(ast, pattern, [
        {
          method: 'where',
          args: [(U as any).ThisExpression().some()],
        },
      ]),
    ).toBeNull()
  })

  it('.atLeast(3) accepts with exactly 3', () => {
    expect(
      match(ast, pattern, [
        {
          method: 'where',
          args: [(U as any).ReturnStatement().atLeast(3)],
        },
      ]),
    ).not.toBeNull()
  })

  it('.atLeast(4) rejects with only 3', () => {
    expect(
      match(ast, pattern, [
        {
          method: 'where',
          args: [(U as any).ReturnStatement().atLeast(4)],
        },
      ]),
    ).toBeNull()
  })

  it('.atMost(3) accepts with exactly 3', () => {
    expect(
      match(ast, pattern, [
        {
          method: 'where',
          args: [(U as any).ReturnStatement().atMost(3)],
        },
      ]),
    ).not.toBeNull()
  })

  it('.atMost(2) rejects with 3', () => {
    expect(
      match(ast, pattern, [
        {
          method: 'where',
          args: [(U as any).ReturnStatement().atMost(2)],
        },
      ]),
    ).toBeNull()
  })

  it('.atMost(0) accepts with zero matches (like .none())', () => {
    expect(
      match(ast, pattern, [
        {
          method: 'where',
          args: [(U as any).ThisExpression().atMost(0)],
        },
      ]),
    ).not.toBeNull()
  })

  it('.exactly(3) accepts with exactly 3', () => {
    expect(
      match(ast, pattern, [
        {
          method: 'where',
          args: [(U as any).ReturnStatement().exactly(3)],
        },
      ]),
    ).not.toBeNull()
  })

  it('.exactly(2) rejects with 3', () => {
    expect(
      match(ast, pattern, [
        {
          method: 'where',
          args: [(U as any).ReturnStatement().exactly(2)],
        },
      ]),
    ).toBeNull()
  })

  it('.exactly(0) accepts with zero matches', () => {
    expect(
      match(ast, pattern, [
        {
          method: 'where',
          args: [(U as any).ThisExpression().exactly(0)],
        },
      ]),
    ).not.toBeNull()
  })

  it('quantifiers respect .until() boundaries', () => {
    expect(
      match(
        {
          type: 'Program',
          name: 'p',

          body: [
            {
              type: 'ReturnStatement',

              argument: {
                type: 'Literal',
                value: 1,
              },
            },
            {
              type: 'FunctionExpression',

              body: {
                type: 'BlockStatement',

                body: [
                  {
                    type: 'ReturnStatement',

                    argument: {
                      type: 'Literal',
                      value: 2,
                    },
                  },
                  {
                    type: 'ReturnStatement',

                    argument: {
                      type: 'Literal',
                      value: 3,
                    },
                  },
                ],
              },
            },
          ],
        },
        pattern,
        [
          {
            method: 'where',

            args: [
              (U as any)
                .ReturnStatement()
                .until((U as any).FunctionExpression())
                .exactly(1),
            ],
          },
        ],
      ),
    ).not.toBeNull()
  })

  it('accepts a root proxy and checks its tag', () => {
    const literal = { type: 'Literal', value: 1 }
    const array = { type: 'ArrayExpression', elements: [] }
    expect(match(literal, (U as any).ArrayExpression())).toBeNull()
    expect(match(array, (U as any).ArrayExpression())).toEqual({})
    expect(
      match(array, (U as any).ArrayExpression({ elements: $('els') })),
    ).toEqual({ els: [] })
  })

  it("applies a root proxy's own .when() guard", () => {
    expect(
      match(
        {
          type: 'ArrayExpression',
          elements: [],
        },
        (U as any).ArrayExpression().when(() => false),
      ),
    ).toBeNull()
  })
})

describe('an object pattern against a null slot', () => {
  it('does not match, and does not throw', () => {
    const node = { type: 'Literal', value: null, raw: 'null' }
    const pattern = U.Literal({ value: { flags: 'g' } as unknown as RegExp })
    expect(() => match(node, pattern)).not.toThrow()
    expect(match(node, pattern)).toBeNull()
  })
})
