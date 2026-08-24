import { match, extractPatterns } from '@ts-unify/engine'
import { ifReturnToTernary } from '@ts-unify/rules'

describe('ifReturnToTernary matching', () => {
  const rule = extractPatterns(ifReturnToTernary)[0]!

  it('extracts as an IfStatement pattern', () => {
    expect(rule.tag).toBe('IfStatement')
  })

  it('matches if (c) { return a; } else { return b; }', () => {
    const bag = match(
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
      rule.pattern,
    )

    expect(bag).not.toBeNull()

    expect(bag!.test).toEqual({
      type: 'Identifier',
      name: 'cond',
    })
  })

  it('matches if (c) return a; else return b; (blockless)', () => {
    expect(
      match(
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
              value: 1,
            },
          },

          alternate: {
            type: 'ReturnStatement',

            argument: {
              type: 'Literal',
              value: 2,
            },
          },
        },
        rule.pattern,
      ),
    ).not.toBeNull()
  })

  it('rejects an IfStatement without an alternate branch', () => {
    expect(
      match(
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

          alternate: null,
        },
        rule.pattern,
      ),
    ).toBeNull()
  })

  it('rejects when consequent is not a return statement', () => {
    expect(
      match(
        {
          type: 'IfStatement',

          test: {
            type: 'Identifier',
            name: 'cond',
          },

          consequent: {
            type: 'ThrowStatement',

            argument: {
              type: 'Literal',
              value: 'err',
            },
          },

          alternate: {
            type: 'ReturnStatement',

            argument: {
              type: 'Literal',
              value: 2,
            },
          },
        },
        rule.pattern,
      ),
    ).toBeNull()
  })
})
