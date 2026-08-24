/**
 * The patterns extractPatterns reads off guardAndAccessToOptionalChain, matched
 * against hand-built nodes.
 *
 * @scenario
 */
import { match, extractPatterns } from '@ts-unify/engine'
import { guardAndAccessToOptionalChain } from '@ts-unify/rules'

describe('guard-and-access-to-optional-chain.match', () => {
  const rule = extractPatterns(guardAndAccessToOptionalChain)[0]

  it('matches obj && obj.prop', () => {
    const obj = {
      type: 'Identifier',
      name: 'obj',
    }

    const bag = match(
      {
        type: 'LogicalExpression',
        operator: '&&',
        left: obj,

        right: {
          type: 'MemberExpression',
          object: obj,

          property: {
            type: 'Identifier',
            name: 'prop',
          },

          computed: false,
          optional: false,
        },
      },
      rule.pattern,
    )

    expect(bag).not.toBeNull()
    expect(bag?.obj).toEqual(obj)

    expect(bag?.prop).toEqual({
      type: 'Identifier',
      name: 'prop',
    })
  })

  it('rejects obj || obj.prop', () => {
    const obj = {
      type: 'Identifier',
      name: 'obj',
    }

    expect(
      match(
        {
          type: 'LogicalExpression',
          operator: '||',
          left: obj,

          right: {
            type: 'MemberExpression',
            object: obj,

            property: {
              type: 'Identifier',
              name: 'prop',
            },

            computed: false,
            optional: false,
          },
        },
        rule.pattern,
      ),
    ).toBeNull()
  })
})
