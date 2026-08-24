/**
 * The patterns extractPatterns reads off typeofUndefinedToNullishCheck, matched
 * against hand-built nodes.
 *
 * @scenario
 */
import { match, extractPatterns } from '@ts-unify/engine'
import { typeofUndefinedToNullishCheck } from '@ts-unify/rules'

describe('typeof-undefined-to-nullish-check.match', () => {
  const rule = extractPatterns(typeofUndefinedToNullishCheck)[0]

  it("matches typeof x === 'undefined'", () => {
    const bag = match(
      {
        type: 'BinaryExpression',
        operator: '===',

        left: {
          type: 'UnaryExpression',
          operator: 'typeof',

          argument: {
            type: 'Identifier',
            name: 'x',
          },
        },

        right: {
          type: 'Literal',
          value: 'undefined',
        },
      },
      rule.pattern,
    )

    expect(bag).not.toBeNull()

    expect(bag?.expr).toEqual({
      type: 'Identifier',
      name: 'x',
    })
  })

  it("rejects typeof x === 'string'", () => {
    expect(
      match(
        {
          type: 'BinaryExpression',
          operator: '===',

          left: {
            type: 'UnaryExpression',
            operator: 'typeof',

            argument: {
              type: 'Identifier',
              name: 'x',
            },
          },

          right: {
            type: 'Literal',
            value: 'string',
          },
        },
        rule.pattern,
      ),
    ).toBeNull()
  })
})
