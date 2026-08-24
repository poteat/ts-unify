/**
 * The patterns extractPatterns reads off normalizeTernaryOrder, matched against
 * hand-built nodes.
 *
 * @scenario
 */
import { match, extractPatterns } from '@ts-unify/engine'
import { normalizeTernaryOrder } from '@ts-unify/rules'

describe('normalize-ternary-order.match', () => {
  const patterns = extractPatterns(normalizeTernaryOrder)

  it('extracts two ConditionalExpression branches', () => {
    expect(patterns).toHaveLength(2)
    expect(patterns[0].tag).toBe('ConditionalExpression')
    expect(patterns[1].tag).toBe('ConditionalExpression')
  })

  it('branch 1 matches !cond ? a : b', () => {
    const bag = match(
      {
        type: 'ConditionalExpression',

        test: {
          type: 'UnaryExpression',
          operator: '!',

          argument: {
            type: 'Identifier',
            name: 'cond',
          },
        },

        consequent: {
          type: 'Literal',
          value: 1,
        },

        alternate: {
          type: 'Literal',
          value: 2,
        },
      },
      patterns[0].pattern,
    )

    expect(bag).not.toBeNull()

    expect(bag?.condition).toEqual({
      type: 'Identifier',
      name: 'cond',
    })
  })

  it('branch 2 matches x !== y ? a : b', () => {
    const bag = match(
      {
        type: 'ConditionalExpression',

        test: {
          type: 'BinaryExpression',
          operator: '!==',

          left: {
            type: 'Identifier',
            name: 'x',
          },

          right: {
            type: 'Identifier',
            name: 'y',
          },
        },

        consequent: {
          type: 'Literal',
          value: 1,
        },

        alternate: {
          type: 'Literal',
          value: 2,
        },
      },
      patterns[1].pattern,
      patterns[1].chain,
    )

    expect(bag).not.toBeNull()
    expect(bag?.operator).toBe('!==')
  })

  it('branch 2 matches x != y ? a : b', () => {
    const bag = match(
      {
        type: 'ConditionalExpression',

        test: {
          type: 'BinaryExpression',
          operator: '!=',

          left: {
            type: 'Identifier',
            name: 'x',
          },

          right: {
            type: 'Identifier',
            name: 'y',
          },
        },

        consequent: {
          type: 'Literal',
          value: 1,
        },

        alternate: {
          type: 'Literal',
          value: 2,
        },
      },
      patterns[1].pattern,
      patterns[1].chain,
    )

    expect(bag).not.toBeNull()
    expect(bag?.operator).toBe('!=')
  })

  it('branch 2 rejects x === y ? a : b (when guard filters it out)', () => {
    expect(
      match(
        {
          type: 'ConditionalExpression',

          test: {
            type: 'BinaryExpression',
            operator: '===',

            left: {
              type: 'Identifier',
              name: 'x',
            },

            right: {
              type: 'Identifier',
              name: 'y',
            },
          },

          consequent: {
            type: 'Literal',
            value: 1,
          },

          alternate: {
            type: 'Literal',
            value: 2,
          },
        },
        patterns[1].pattern,
        patterns[1].chain,
      ),
    ).toBeNull()
  })

  it('branch 2 rejects x == y ? a : b (when guard filters it out)', () => {
    expect(
      match(
        {
          type: 'ConditionalExpression',

          test: {
            type: 'BinaryExpression',
            operator: '==',

            left: {
              type: 'Identifier',
              name: 'x',
            },

            right: {
              type: 'Identifier',
              name: 'y',
            },
          },

          consequent: {
            type: 'Literal',
            value: 1,
          },

          alternate: {
            type: 'Literal',
            value: 2,
          },
        },
        patterns[1].pattern,
        patterns[1].chain,
      ),
    ).toBeNull()
  })

  it('branch 1 rejects cond ? a : b (no negation)', () => {
    expect(
      match(
        {
          type: 'ConditionalExpression',

          test: {
            type: 'Identifier',
            name: 'cond',
          },

          consequent: {
            type: 'Literal',
            value: 1,
          },

          alternate: {
            type: 'Literal',
            value: 2,
          },
        },
        patterns[0].pattern,
      ),
    ).toBeNull()
  })
})
