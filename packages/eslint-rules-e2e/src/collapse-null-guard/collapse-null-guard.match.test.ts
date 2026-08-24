/**
 * The patterns extractPatterns reads off collapseNullGuard, matched against
 * hand-built nodes.
 *
 * @scenario
 */
import { match, extractPatterns } from '@ts-unify/engine'
import { collapseNullGuard } from '@ts-unify/rules'

describe('collapse-null-guard.match', () => {
  const rule = extractPatterns(collapseNullGuard)[0]

  it('extracts as a BlockStatement pattern', () => {
    expect(rule.tag).toBe('BlockStatement')
  })

  it('matches if (x === null) return def; return x;', () => {
    const bag = match(
      {
        type: 'BlockStatement',

        body: [
          {
            type: 'ExpressionStatement',

            expression: {
              type: 'Identifier',
              name: 'setup',
            },
          },
          {
            type: 'IfStatement',

            test: {
              type: 'BinaryExpression',
              operator: '===',

              left: {
                type: 'Identifier',
                name: 'x',
              },

              right: {
                type: 'Literal',
                value: null,
              },
            },

            consequent: {
              type: 'ReturnStatement',

              argument: {
                type: 'Identifier',
                name: 'def',
              },
            },

            alternate: null,
          },
          {
            type: 'ReturnStatement',

            argument: {
              type: 'Identifier',
              name: 'x',
            },
          },
        ],
      },
      rule.pattern,
    )

    expect(bag).not.toBeNull()

    expect(bag?.value).toEqual({
      type: 'Identifier',
      name: 'x',
    })

    expect(bag?.fallback).toEqual({
      type: 'Identifier',
      name: 'def',
    })
  })

  it('matches with no leading statements', () => {
    const bag = match(
      {
        type: 'BlockStatement',

        body: [
          {
            type: 'IfStatement',

            test: {
              type: 'BinaryExpression',
              operator: '===',

              left: {
                type: 'Identifier',
                name: 'val',
              },

              right: {
                type: 'Literal',
                value: null,
              },
            },

            consequent: {
              type: 'ReturnStatement',

              argument: {
                type: 'Literal',
                value: 0,
              },
            },

            alternate: null,
          },
          {
            type: 'ReturnStatement',

            argument: {
              type: 'Identifier',
              name: 'val',
            },
          },
        ],
      },
      rule.pattern,
    )

    expect(bag).not.toBeNull()
    expect(bag?.body).toEqual([])
  })

  it('rejects when null check has wrong operator', () => {
    expect(
      match(
        {
          type: 'BlockStatement',

          body: [
            {
              type: 'IfStatement',

              test: {
                type: 'BinaryExpression',
                operator: '!==',

                left: {
                  type: 'Identifier',
                  name: 'x',
                },

                right: {
                  type: 'Literal',
                  value: null,
                },
              },

              consequent: {
                type: 'ReturnStatement',

                argument: {
                  type: 'Identifier',
                  name: 'def',
                },
              },

              alternate: null,
            },
            {
              type: 'ReturnStatement',

              argument: {
                type: 'Identifier',
                name: 'x',
              },
            },
          ],
        },
        rule.pattern,
      ),
    ).toBeNull()
  })

  it('rejects a BlockStatement whose body is not an array', () => {
    expect(
      match(
        {
          type: 'BlockStatement',
          body: 'not-an-array',
        },
        rule.pattern,
      ),
    ).toBeNull()
  })
})
