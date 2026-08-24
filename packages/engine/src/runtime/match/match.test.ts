import { $, C, U } from '@ts-unify/core/internal'

import TestUtils from '../../test-utils'
import CommentNodes from '../comment-nodes'
import Fixtures from './fixtures'
import { match } from './match'
import Pattern from './pattern'

describe('match', () => {
  describe('comments', () => {
    it('matches a Comment node directly, with captures on its fields', () => {
      const [c] = CommentNodes.commentNodes(
        Fixtures.program('// todo later\nx;'),
      )

      expect(match(c, U.Comment({ kind: 'line', text: $('text') }))).toEqual({
        text: ' todo later',
      })
      expect(match(c, U.Comment({ kind: 'block' }))).toBeNull()
    })

    it('sees a raw comment under Program.comments as its node view', () => {
      expect(
        match(
          Fixtures.program('/** header */\n// a\nexport const x = 1;'),
          U.Program({
            comments: [
              U.Comment({ kind: 'jsdoc', text: $('h') }),
              ...$('rest'),
            ],
          }),
        ),
      ).toMatchObject({ h: 'header', rest: [expect.any(Object)] })
    })

    it('finds a comment anywhere in the list with two spreads', () => {
      expect(
        match(
          Fixtures.program('// a\n/* b */\n// c\nx;'),
          U.Program({
            comments: [...$, U.Comment({ kind: 'block', text: $('b') }), ...$],
          }),
        ),
      ).toMatchObject({ b: ' b ' })
    })

    it('does not match a raw comment to U.Comment outside a Program', () => {
      expect(
        match(Fixtures.program('// a\nx;').comments[0], U.Comment()),
      ).toBeNull()
    })

    it('reads the attached declaration through a nested pattern', () => {
      const [c] = CommentNodes.commentNodes(
        Fixtures.program('/** Adds. */\nfunction add() {}'),
      )

      expect(
        match(
          c,
          U.Comment({
            kind: 'jsdoc',
            summary: $('summary'),

            attachedTo: U.FunctionDeclaration({
              id: U.Identifier({ name: $('name') }),
            }),
          }),
        ),
      ).toMatchObject({ name: 'add', summary: ['Adds.'] })
    })

    it('counts summary lines with a sequence pattern', () => {
      const [long] = CommentNodes.commentNodes(
        Fixtures.program('/**\n * one\n * two\n * three\n */\nx;'),
      )
      const [short] = CommentNodes.commentNodes(
        Fixtures.program('/** one */\nx;'),
      )
      const threeOrMore = U.Comment({
        kind: 'jsdoc',
        summary: [$, $, $, ...$],
      })

      expect(match(long, threeOrMore)).not.toBeNull()
      expect(match(short, threeOrMore)).toBeNull()
    })

    it('matches a null attachedTo literally', () => {
      const [floating, doc] = CommentNodes.commentNodes(
        Fixtures.program(
          'function f() {\n  /** floating */\n}\n/** doc */\nconst a = 1;',
        ),
      )
      const detached = U.Comment({ kind: 'jsdoc', attachedTo: null })

      expect(match(floating, detached)).toEqual({})
      expect(match(doc, detached)).toBeNull()
    })
  })

  describe('a frozen pattern', () => {
    it('matches when frozen at module scope', () => {
      const NAMED = Object.freeze(U.Identifier({ name: $('n') }))

      expect(match(TestUtils.identifier('foo'), NAMED)).toEqual({ n: 'foo' })
      expect(match({ type: 'Literal', value: 1 }, NAMED)).toBeNull()
    })

    it('matches when narrowed after freezing', () => {
      const SHORT = Object.freeze(U.Identifier({ name: $('n') })).when(
        (it: { n: string }) => it.n.length < 4,
      )

      expect(match(TestUtils.identifier('foo'), SHORT)).toEqual({ n: 'foo' })
      expect(match(TestUtils.identifier('quux'), SHORT)).toBeNull()
    })

    it('matches when embedded in a larger one', () => {
      const RET = U.ReturnStatement({
        argument: Object.freeze(U.Identifier({ name: $('n') })),
      })

      expect(
        match(
          { type: 'ReturnStatement', argument: TestUtils.identifier('x') },
          RET,
        ),
      ).toEqual({ n: 'x' })
    })
  })

  describe('a string predicate', () => {
    it('tests a string position against a RegExp', () => {
      expect(
        match(TestUtils.identifier('fooBar'), U.Identifier({ name: /^foo/ })),
      ).toEqual({})
      expect(
        match(TestUtils.identifier('bar'), U.Identifier({ name: /^foo/ })),
      ).toBeNull()
      expect(
        match(
          TestUtils.identifier('bar'),
          U.Identifier({ name: U.string.regex(/^b/) }),
        ),
      ).toEqual({})
    })

    it('never matches a non-string', () => {
      expect(
        match({ type: 'Literal', value: 42 }, U.Literal({ value: /4/ })),
      ).toBeNull()
      expect(
        match(
          { type: 'Literal', value: 42 },
          U.Literal({ value: U.string.identifierName() }),
        ),
      ).toBeNull()
    })

    it('matches a reserved word with U.string.reserved, no near miss', () => {
      const p = U.Identifier({ name: U.string.reserved() })

      expect(match(TestUtils.identifier('class'), p)).toEqual({})
      expect(match(TestUtils.identifier('let'), p)).toEqual({})
      expect(match(TestUtils.identifier('klass'), p)).toBeNull()
    })

    it('reads the strict and typescript options of U.string.reserved', () => {
      expect(
        match(
          TestUtils.identifier('let'),
          U.Identifier({ name: U.string.reserved({ isStrict: false }) }),
        ),
      ).toBeNull()
      expect(
        match(
          TestUtils.identifier('type'),
          U.Identifier({ name: U.string.reserved({ isTypeScript: true }) }),
        ),
      ).toEqual({})
    })

    it('matches an IdentifierName key and negates with U.string.not', () => {
      const needless = U.Property({
        key: U.Literal({ value: U.string.identifierName() }),
      })
      const bindable = U.Identifier({
        name: U.string.not(U.string.reserved()),
      })

      expect(
        match(Fixtures.property({ type: 'Literal', value: 'name' }), needless),
      ).toEqual({})
      expect(
        match(
          Fixtures.property({ type: 'Literal', value: 'data-id' }),
          needless,
        ),
      ).toBeNull()
      expect(match(TestUtils.identifier('klass'), bindable)).toEqual({})
      expect(match(TestUtils.identifier('class'), bindable)).toBeNull()
    })

    it('works in sequence positions and beside captures', () => {
      expect(
        match(
          {
            type: 'CallExpression',
            callee: TestUtils.identifier('log'),
            arguments: [{ type: 'Literal', value: 'hello' }],
          },
          U.CallExpression({
            callee: U.Identifier({ name: /^(log|warn)$/ }),
            arguments: [U.Literal({ value: $('v') })],
          }),
        ),
      ).toEqual({ v: 'hello' })
    })

    it('applies a .when over a U.or capture, whichever branch bound it', () => {
      const key = U.or(
        U.Identifier({ name: $('key') }),
        U.Literal({ value: $('key') }),
      ).when(
        (bag: { key: unknown }): bag is { key: string } =>
          U.string.identifierName()(bag.key) && !U.string.reserved()(bag.key),
      )
      const p = U.Property({ key, value: U.Identifier({ name: 'v' }) })

      expect(match(Fixtures.property(TestUtils.identifier('name')), p)).toEqual(
        { key: 'name' },
      )
      expect(
        match(Fixtures.property({ type: 'Literal', value: 'name' }), p),
      ).toEqual({ key: 'name' })
      expect(
        match(Fixtures.property(TestUtils.identifier('class')), p),
      ).toBeNull()
      expect(
        match(Fixtures.property({ type: 'Literal', value: 'data-id' }), p),
      ).toBeNull()
      expect(
        match(Fixtures.property({ type: 'Literal', value: 1 }), p),
      ).toBeNull()
    })

    it('resets a global RegExp between tests', () => {
      const p = U.Identifier({ name: /a/g })

      expect(match(TestUtils.identifier('a'), p)).toEqual({})
      expect(match(TestUtils.identifier('a'), p)).toEqual({})
    })
  })

  describe('seal', () => {
    it('re-keys a single inner capture to the parent property name', () => {
      const bag = match(
        {
          type: 'IfStatement',
          test: { type: 'Identifier', name: 'cond' },

          consequent: {
            type: 'ReturnStatement',
            argument: { type: 'Literal', value: 1 },
          },
        },
        {
          test: $,
          consequent: U.ReturnStatement({ argument: $ }).seal(),
        },
      )

      expect(bag).toEqual({
        consequent: { type: 'Literal', value: 1 },
        test: { type: 'Identifier', name: 'cond' },
      })
      expect(bag).not.toHaveProperty('argument')
    })

    it('passes through an empty bag when seal has zero captures', () => {
      expect(
        match(
          { type: 'SomeNode', value: { type: 'Identifier', name: 'foo' } },
          { value: U.Identifier({ name: 'foo' }).seal() },
        ),
      ).toEqual({})
    })

    it('works with maybeBlock and seal, as if-return-to-ternary does', () => {
      const anyReturnForm = U.maybeBlock(
        U.ReturnStatement({ argument: $ }),
      ).seal()

      expect(
        match(
          {
            type: 'IfStatement',
            test: { type: 'Identifier', name: 'cond' },

            consequent: {
              type: 'BlockStatement',

              body: [
                {
                  type: 'ReturnStatement',
                  argument: { type: 'Literal', value: 1 },
                },
              ],
            },

            alternate: {
              type: 'BlockStatement',

              body: [
                {
                  type: 'ReturnStatement',
                  argument: { type: 'Literal', value: 2 },
                },
              ],
            },
          },
          { test: $, consequent: anyReturnForm, alternate: anyReturnForm },
        ),
      ).toEqual({
        consequent: { type: 'Literal', value: 1 },
        alternate: { type: 'Literal', value: 2 },
        test: { type: 'Identifier', name: 'cond' },
      })

      expect(
        match(
          {
            type: 'IfStatement',
            test: { type: 'Identifier', name: 'x' },

            consequent: {
              type: 'ReturnStatement',
              argument: { type: 'Identifier', name: 'a' },
            },

            alternate: {
              type: 'ReturnStatement',
              argument: { type: 'Identifier', name: 'b' },
            },
          },
          { test: $, consequent: anyReturnForm, alternate: anyReturnForm },
        ),
      ).toEqual({
        consequent: { type: 'Identifier', name: 'a' },
        alternate: { type: 'Identifier', name: 'b' },
        test: { type: 'Identifier', name: 'x' },
      })
    })
  })

  describe('bind', () => {
    it('re-keys a bare bind() under a property to that property', () => {
      const ast = {
        type: 'BlockStatement',

        body: [
          {
            type: 'ExpressionStatement',
            expression: { type: 'Identifier', name: 'x' },
          },
        ],
      }
      const exprBlock = Fixtures.expressionBlock().bind()

      expect(Pattern.patternNodeOf(exprBlock).tag).toBe('BlockStatement')

      const bag = match({ type: 'SomeNode', body: ast }, { body: exprBlock })

      expect(bag?.body).toBe(ast)
      expect(bag).toEqual({ body: ast })
    })

    it("captures the whole node under a custom name with bind('name')", () => {
      const ast = {
        type: 'BlockStatement',

        body: [
          {
            type: 'ExpressionStatement',
            expression: { type: 'Literal', value: 1 },
          },
        ],
      }
      const bag = match(
        { type: 'SomeNode', body: ast },
        { body: Fixtures.expressionBlock().bind('myBlock') },
      )

      expect(bag?.myBlock).toBe(ast)
      expect(bag).toEqual({ myBlock: ast })
    })

    it('still validates structure before binding', () => {
      expect(
        match(
          {
            type: 'SomeNode',
            body: {
              type: 'BlockStatement',
              body: [{ type: 'ThrowStatement' }],
            },
          },
          {
            body: U.BlockStatement({
              body: [U.ReturnStatement({ argument: $ })],
            }).bind('result'),
          },
        ),
      ).toBeNull()
    })
  })

  describe('defaultUndefined', () => {
    it('is a type-level modifier; $ already captures null', () => {
      expect(
        match(
          {
            type: 'SomeNode',
            stmt: { type: 'ReturnStatement', argument: null },
          },
          { stmt: U.ReturnStatement({ argument: $ }).defaultUndefined() },
        ),
      ).toEqual({ argument: null })
    })

    it('works with seal, which re-keys the captured null', () => {
      const bag = match(
        { type: 'SomeNode', stmt: { type: 'ReturnStatement', argument: null } },
        { stmt: U.ReturnStatement({ argument: $ }).defaultUndefined().seal() },
      )

      expect(bag).toEqual({ stmt: null })
      expect(bag).not.toHaveProperty('argument')
    })

    it('does not make the proxy match a null node', () => {
      expect(
        match(
          { type: 'IfStatement', alternate: null },
          {
            alternate: U.maybeBlock(U.ReturnStatement({ argument: $ }))
              .defaultUndefined()
              .seal(),
          },
        ),
      ).toBeNull()
    })
  })

  describe('a config slot', () => {
    it('matches a value against the config default', () => {
      expect(
        match(
          { type: 'CallExpression', callee: TestUtils.identifier('uniq') },
          { callee: { type: 'Identifier', name: C('fn') } },
          [{ method: 'config', args: [{ fn: 'uniq' }] }],
        ),
      ).not.toBeNull()
    })

    it('rejects a value other than the config default', () => {
      expect(
        match(
          { type: 'CallExpression', callee: TestUtils.identifier('map') },
          { callee: { type: 'Identifier', name: C('fn') } },
          [{ method: 'config', args: [{ fn: 'uniq' }] }],
        ),
      ).toBeNull()
    })

    it('works in arrays', () => {
      expect(
        match(
          { type: 'ArrayExpression', elements: ['hello'] },
          { elements: [C('val')] },
          [{ method: 'config', args: [{ val: 'hello' }] }],
        ),
      ).not.toBeNull()
    })

    it('rejects with missing config defaults', () => {
      expect(
        match({ type: 'Identifier', name: 'foo' }, { name: C('fn') }, []),
      ).toBeNull()
    })
  })

  describe('seal, bind and or together', () => {
    it('handles the singular-function-to-arrow pattern', () => {
      const orPattern = U.or(
        U.BlockStatement({
          body: [U.ReturnStatement({ argument: $ }).defaultUndefined()],
        }).seal(),
        Fixtures.expressionBlock().bind(),
      )

      expect(
        match(
          {
            type: 'SomeNode',

            body: {
              type: 'BlockStatement',

              body: [
                {
                  type: 'ReturnStatement',
                  argument: { type: 'Literal', value: 1 },
                },
              ],
            },
          },
          { body: orPattern },
        ),
      ).toEqual({ body: { type: 'Literal', value: 1 } })

      const exprAst = {
        type: 'BlockStatement',

        body: [
          {
            type: 'ExpressionStatement',
            expression: { type: 'Identifier', name: 'doStuff' },
          },
        ],
      }
      const bag = match(
        { type: 'SomeNode', body: exprAst },
        { body: orPattern },
      )

      expect(bag?.body).toBe(exprAst)
      expect(bag).toEqual({ body: exprAst })
    })
  })

  describe('where with none', () => {
    const returningThisInner = Fixtures.returning({
      type: 'FunctionExpression',

      body: {
        type: 'BlockStatement',

        body: [
          { type: 'ReturnStatement', argument: { type: 'ThisExpression' } },
        ],
      },
    })
    const noThisUntilFunction = Fixtures.whereChain(
      U.ThisExpression().until(U.FunctionExpression()).none(),
    )

    it('rejects when the pattern appears in the subtree', () => {
      expect(
        match(
          Fixtures.returning({ type: 'ThisExpression' }),
          { name: $ },
          Fixtures.whereChain(U.ThisExpression().none()),
        ),
      ).toBeNull()
    })

    it('accepts when the pattern is absent', () => {
      expect(
        match(
          Fixtures.returning({ type: 'Literal', value: 1 }),
          { name: $ },
          Fixtures.whereChain(U.ThisExpression().none()),
        ),
      ).toEqual({ name: 'f' })
    })

    it('respects an .until() boundary the pattern sits behind', () => {
      expect(
        match(returningThisInner, { name: $ }, noThisUntilFunction),
      ).toEqual({ name: 'f' })
    })

    it('rejects when the pattern is before the boundary', () => {
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
                  expression: { type: 'ThisExpression' },
                },
              ],
            },
          },
          { name: $ },
          noThisUntilFunction,
        ),
      ).toBeNull()
    })

    it('checks the boundary node itself against the pattern', () => {
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
                    body: { type: 'BlockStatement', body: [] },
                  },
                },
              ],
            },
          },
          { name: $ },
          Fixtures.whereChain(
            U.FunctionExpression().until(U.FunctionExpression()).none(),
          ),
        ),
      ).toBeNull()
    })

    it('handles a U.or() boundary of several types', () => {
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
                      argument: { type: 'ThisExpression' },
                    },
                  ],
                },
              },
            ],
          },
          { name: $ },
          Fixtures.whereChain(
            U.ThisExpression()
              .until(U.or(U.FunctionDeclaration(), U.FunctionExpression()))
              .none(),
          ),
        ),
      ).not.toBeNull()
    })

    it('composes several .where() entries, all of which must pass', () => {
      expect(
        match(
          Fixtures.returning({ type: 'Identifier', name: 'arguments' }),
          { name: $ },
          [
            ...Fixtures.whereChain(U.ThisExpression().none()),
            ...Fixtures.whereChain(U.Identifier({ name: 'arguments' }).none()),
          ],
        ),
      ).toBeNull()
    })

    it('reads the whole structure of the excluded pattern', () => {
      expect(
        match(
          Fixtures.returning({ type: 'Identifier', name: 'x' }),
          { name: $ },
          Fixtures.whereChain(U.Identifier({ name: 'arguments' }).none()),
        ),
      ).not.toBeNull()
    })

    it('checks default parameter values as well as the body', () => {
      expect(
        match(
          {
            type: 'FunctionDeclaration',
            name: 'f',

            params: [
              {
                type: 'AssignmentPattern',
                left: { type: 'Identifier', name: 'x' },

                right: {
                  type: 'MemberExpression',
                  object: { type: 'ThisExpression' },
                  property: { type: 'Identifier', name: 'foo' },
                },
              },
            ],

            body: {
              type: 'BlockStatement',

              body: [
                {
                  type: 'ReturnStatement',
                  argument: { type: 'Identifier', name: 'x' },
                },
              ],
            },
          },
          { name: $ },
          noThisUntilFunction,
        ),
      ).toBeNull()
    })

    it('handles a U.or() in the excluded pattern', () => {
      const chain = Fixtures.whereChain(
        U.or(U.ThisExpression(), U.Identifier({ name: 'arguments' }))
          .until(U.FunctionExpression())
          .none(),
      )

      expect(
        match(
          Fixtures.returning({ type: 'ThisExpression' }),
          { name: $ },
          chain,
        ),
      ).toBeNull()
      expect(
        match(
          Fixtures.returning({ type: 'Identifier', name: 'arguments' }),
          { name: $ },
          chain,
        ),
      ).toBeNull()
      expect(
        match(
          Fixtures.returning({ type: 'Literal', value: 1 }),
          { name: $ },
          chain,
        ),
      ).not.toBeNull()
      expect(match(returningThisInner, { name: $ }, chain)).not.toBeNull()
    })
  })

  describe('where with a quantifier', () => {
    const pattern = { name: $ }

    it('.some() accepts when at least one match exists', () => {
      expect(
        match(
          Fixtures.THREE_RETURNS,
          pattern,
          Fixtures.whereChain(U.ReturnStatement().some()),
        ),
      ).not.toBeNull()
    })

    it('.some() rejects when nothing matches', () => {
      expect(
        match(
          Fixtures.THREE_RETURNS,
          pattern,
          Fixtures.whereChain(U.ThisExpression().some()),
        ),
      ).toBeNull()
    })

    it('.atLeast(3) accepts exactly 3', () => {
      expect(
        match(
          Fixtures.THREE_RETURNS,
          pattern,
          Fixtures.whereChain(U.ReturnStatement().atLeast(3)),
        ),
      ).not.toBeNull()
    })

    it('.atLeast(4) rejects 3', () => {
      expect(
        match(
          Fixtures.THREE_RETURNS,
          pattern,
          Fixtures.whereChain(U.ReturnStatement().atLeast(4)),
        ),
      ).toBeNull()
    })

    it('.atMost(3) accepts exactly 3', () => {
      expect(
        match(
          Fixtures.THREE_RETURNS,
          pattern,
          Fixtures.whereChain(U.ReturnStatement().atMost(3)),
        ),
      ).not.toBeNull()
    })

    it('.atMost(2) rejects 3', () => {
      expect(
        match(
          Fixtures.THREE_RETURNS,
          pattern,
          Fixtures.whereChain(U.ReturnStatement().atMost(2)),
        ),
      ).toBeNull()
    })

    it('.atMost(0) accepts no match, as .none() does', () => {
      expect(
        match(
          Fixtures.THREE_RETURNS,
          pattern,
          Fixtures.whereChain(U.ThisExpression().atMost(0)),
        ),
      ).not.toBeNull()
    })

    it('.exactly(3) accepts exactly 3', () => {
      expect(
        match(
          Fixtures.THREE_RETURNS,
          pattern,
          Fixtures.whereChain(U.ReturnStatement().exactly(3)),
        ),
      ).not.toBeNull()
    })

    it('.exactly(2) rejects 3', () => {
      expect(
        match(
          Fixtures.THREE_RETURNS,
          pattern,
          Fixtures.whereChain(U.ReturnStatement().exactly(2)),
        ),
      ).toBeNull()
    })

    it('.exactly(0) accepts no match', () => {
      expect(
        match(
          Fixtures.THREE_RETURNS,
          pattern,
          Fixtures.whereChain(U.ThisExpression().exactly(0)),
        ),
      ).not.toBeNull()
    })

    it('respects .until() boundaries', () => {
      expect(
        match(
          {
            type: 'Program',
            name: 'p',

            body: [
              {
                type: 'ReturnStatement',
                argument: { type: 'Literal', value: 1 },
              },
              {
                type: 'FunctionExpression',

                body: {
                  type: 'BlockStatement',

                  body: [
                    {
                      type: 'ReturnStatement',
                      argument: { type: 'Literal', value: 2 },
                    },
                    {
                      type: 'ReturnStatement',
                      argument: { type: 'Literal', value: 3 },
                    },
                  ],
                },
              },
            ],
          },
          pattern,
          Fixtures.whereChain(
            U.ReturnStatement().until(U.FunctionExpression()).exactly(1),
          ),
        ),
      ).not.toBeNull()
    })
  })

  describe('a root proxy', () => {
    it('is checked by its tag', () => {
      const literal = { type: 'Literal', value: 1 }
      const array = { type: 'ArrayExpression', elements: [] }

      expect(match(literal, U.ArrayExpression())).toBeNull()
      expect(match(array, U.ArrayExpression())).toEqual({})
      expect(match(array, U.ArrayExpression({ elements: $('els') }))).toEqual({
        els: [],
      })
    })

    it('applies its own .when() guard', () => {
      expect(
        match(
          { type: 'ArrayExpression', elements: [] },
          U.ArrayExpression().when(() => false),
        ),
      ).toBeNull()
    })
  })

  describe('an object pattern against a null slot', () => {
    it('does not match, and does not throw', () => {
      const pattern = U.Literal({ value: { flags: 'g' } as unknown as RegExp })

      expect(() =>
        match({ type: 'Literal', value: null, raw: 'null' }, pattern),
      ).not.toThrow()
      expect(
        match({ type: 'Literal', value: null, raw: 'null' }, pattern),
      ).toBeNull()
    })
  })
})
