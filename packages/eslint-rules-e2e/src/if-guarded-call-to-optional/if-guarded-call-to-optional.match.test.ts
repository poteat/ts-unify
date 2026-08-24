import { match, extractPatterns } from '@ts-unify/engine'
import { ifGuardedCallToOptional } from '@ts-unify/rules'

describe('ifGuardedCallToOptional matching', () => {
  const rule = extractPatterns(ifGuardedCallToOptional)[0]!

  it('extracts as an IfStatement pattern', () => {
    expect(rule.tag).toBe('IfStatement')
  })

  it('matches if (fn) { fn(arg1, arg2); }', () => {
    const bag = match(
      {
        type: 'IfStatement',

        test: {
          type: 'Identifier',
          name: 'fn',
        },

        consequent: {
          type: 'BlockStatement',

          body: [
            {
              type: 'ExpressionStatement',

              expression: {
                type: 'CallExpression',

                callee: {
                  type: 'Identifier',
                  name: 'fn',
                },

                arguments: [
                  {
                    type: 'Literal',
                    value: 1,
                  },
                ],
              },
            },
          ],
        },

        alternate: null,
      },
      rule.pattern,
    )

    expect(bag).not.toBeNull()

    expect(bag!.callee).toEqual({
      type: 'Identifier',
      name: 'fn',
    })
  })

  it('matches if (fn) fn(); (blockless)', () => {
    expect(
      match(
        {
          type: 'IfStatement',

          test: {
            type: 'Identifier',
            name: 'fn',
          },

          consequent: {
            type: 'ExpressionStatement',

            expression: {
              type: 'CallExpression',

              callee: {
                type: 'Identifier',
                name: 'fn',
              },

              arguments: [],
            },
          },

          alternate: null,
        },
        rule.pattern,
      ),
    ).not.toBeNull()
  })

  it('rejects if (fn) { fn(args); } else { ... } (alternate must be null)', () => {
    expect(
      match(
        {
          type: 'IfStatement',

          test: {
            type: 'Identifier',
            name: 'fn',
          },

          consequent: {
            type: 'BlockStatement',

            body: [
              {
                type: 'ExpressionStatement',

                expression: {
                  type: 'CallExpression',

                  callee: {
                    type: 'Identifier',
                    name: 'fn',
                  },

                  arguments: [],
                },
              },
            ],
          },

          alternate: {
            type: 'BlockStatement',
            body: [],
          },
        },
        rule.pattern,
      ),
    ).toBeNull()
  })

  it('rejects when consequent is not a call expression', () => {
    expect(
      match(
        {
          type: 'IfStatement',

          test: {
            type: 'Identifier',
            name: 'fn',
          },

          consequent: {
            type: 'ReturnStatement',
            argument: null,
          },

          alternate: null,
        },
        rule.pattern,
      ),
    ).toBeNull()
  })
})
