/**
 * The patterns extractPatterns reads off spreadNewSetToUniq, matched against
 * hand-built nodes.
 *
 * @scenario
 */
import { match, extractPatterns } from '@ts-unify/engine'
import { spreadNewSetToUniq } from '@ts-unify/rules'

describe('spread-new-set-to-uniq.match', () => {
  const rule = extractPatterns(spreadNewSetToUniq)[0]

  it('matches [...new Set(arr)]', () => {
    const bag = match(
      {
        type: 'ArrayExpression',

        elements: [
          {
            type: 'SpreadElement',

            argument: {
              type: 'NewExpression',

              callee: {
                type: 'Identifier',
                name: 'Set',
              },

              arguments: [
                {
                  type: 'Identifier',
                  name: 'arr',
                },
              ],
            },
          },
        ],
      },
      rule.pattern,
    )

    expect(bag).not.toBeNull()

    expect(bag?.array).toEqual({
      type: 'Identifier',
      name: 'arr',
    })
  })

  it('rejects [...new Map(arr)]', () => {
    expect(
      match(
        {
          type: 'ArrayExpression',

          elements: [
            {
              type: 'SpreadElement',

              argument: {
                type: 'NewExpression',

                callee: {
                  type: 'Identifier',
                  name: 'Map',
                },

                arguments: [
                  {
                    type: 'Identifier',
                    name: 'arr',
                  },
                ],
              },
            },
          ],
        },
        rule.pattern,
      ),
    ).toBeNull()
  })

  it('rejects [new Set(arr)] (no spread)', () => {
    expect(
      match(
        {
          type: 'ArrayExpression',

          elements: [
            {
              type: 'NewExpression',

              callee: {
                type: 'Identifier',
                name: 'Set',
              },

              arguments: [
                {
                  type: 'Identifier',
                  name: 'arr',
                },
              ],
            },
          ],
        },
        rule.pattern,
      ),
    ).toBeNull()
  })
})
