import { match, extractPatterns } from '@ts-unify/engine'
import { singularFunctionToArrow } from '@ts-unify/rules'

describe('singularFunctionToArrow matching', () => {
  const patterns = extractPatterns(singularFunctionToArrow)

  it('extracts two branches: FunctionDeclaration and FunctionExpression', () => {
    expect(patterns).toHaveLength(2)
    expect(patterns[0].tag).toBe('FunctionDeclaration')
    expect(patterns[1].tag).toBe('FunctionExpression')
  })

  it('matches function foo(x) { return x + 1; }', () => {
    expect(
      match(
        {
          type: 'FunctionDeclaration',

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

          generator: false,

          id: {
            type: 'Identifier',
            name: 'foo',
          },

          params: [
            {
              type: 'Identifier',
              name: 'x',
            },
          ],

          async: false,
        },
        patterns[0].pattern,
      ),
    ).not.toBeNull()
  })

  it('matches function expression', () => {
    expect(
      match(
        {
          type: 'FunctionExpression',

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

          generator: false,
          id: null,
          params: [],
          async: false,
        },
        patterns[1].pattern,
      ),
    ).not.toBeNull()
  })

  it('rejects a generator function', () => {
    expect(
      match(
        {
          type: 'FunctionDeclaration',

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

          generator: true,

          id: {
            type: 'Identifier',
            name: 'foo',
          },

          params: [],
          async: false,
        },
        patterns[0].pattern,
      ),
    ).toBeNull()
  })

  it('rejects when body is not a block with single return', () => {
    expect(
      match(
        {
          type: 'FunctionDeclaration',

          body: {
            type: 'BlockStatement',

            body: [
              {
                type: 'ExpressionStatement',

                expression: {
                  type: 'Identifier',
                  name: 'a',
                },
              },
              {
                type: 'ReturnStatement',

                argument: {
                  type: 'Identifier',
                  name: 'b',
                },
              },
            ],
          },

          generator: false,

          id: {
            type: 'Identifier',
            name: 'foo',
          },

          params: [],
          async: false,
        },
        patterns[0].pattern,
      ),
    ).toBeNull()
  })
})
