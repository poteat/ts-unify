import { match, extractPatterns } from '@ts-unify/engine'
import { objectAssignToSpread } from '@ts-unify/rules'

describe('objectAssignToSpread matching', () => {
  const rule = extractPatterns(objectAssignToSpread)[0]!

  it('extracts as a CallExpression pattern', () => {
    expect(rule.tag).toBe('CallExpression')
  })

  it('matches Object.assign({}, a, b)', () => {
    const a = {
      type: 'Identifier',
      name: 'a',
    }

    const b = {
      type: 'Identifier',
      name: 'b',
    }

    const bag = match(
      {
        type: 'CallExpression',

        callee: {
          type: 'MemberExpression',

          object: {
            type: 'Identifier',
            name: 'Object',
          },

          property: {
            type: 'Identifier',
            name: 'assign',
          },

          computed: false,
          optional: false,
        },

        arguments: [
          {
            type: 'ObjectExpression',
            properties: [],
          },
          a,
          b,
        ],

        optional: false,
      },
      rule.pattern,
    )

    expect(bag).not.toBeNull()
    expect(bag!.sources).toEqual([a, b])
  })

  it('matches Object.assign({}, single)', () => {
    const bag = match(
      {
        type: 'CallExpression',

        callee: {
          type: 'MemberExpression',

          object: {
            type: 'Identifier',
            name: 'Object',
          },

          property: {
            type: 'Identifier',
            name: 'assign',
          },

          computed: false,
          optional: false,
        },

        arguments: [
          {
            type: 'ObjectExpression',
            properties: [],
          },
          {
            type: 'Identifier',
            name: 'x',
          },
        ],

        optional: false,
      },
      rule.pattern,
    )

    expect(bag).not.toBeNull()

    expect(bag!.sources).toEqual([
      {
        type: 'Identifier',
        name: 'x',
      },
    ])
  })

  it('rejects Object.create({}) (wrong method name)', () => {
    expect(
      match(
        {
          type: 'CallExpression',

          callee: {
            type: 'MemberExpression',

            object: {
              type: 'Identifier',
              name: 'Object',
            },

            property: {
              type: 'Identifier',
              name: 'create',
            },

            computed: false,
            optional: false,
          },

          arguments: [
            {
              type: 'ObjectExpression',
              properties: [],
            },
          ],

          optional: false,
        },
        rule.pattern,
      ),
    ).toBeNull()
  })

  it('rejects Reflect.assign({}, a) (wrong receiver object)', () => {
    expect(
      match(
        {
          type: 'CallExpression',

          callee: {
            type: 'MemberExpression',

            object: {
              type: 'Identifier',
              name: 'Reflect',
            },

            property: {
              type: 'Identifier',
              name: 'assign',
            },

            computed: false,
            optional: false,
          },

          arguments: [
            {
              type: 'ObjectExpression',
              properties: [],
            },
            {
              type: 'Identifier',
              name: 'a',
            },
          ],

          optional: false,
        },
        rule.pattern,
      ),
    ).toBeNull()
  })

  it('rejects Object.assign(existingObj, a) (first arg not empty object)', () => {
    expect(
      match(
        {
          type: 'CallExpression',

          callee: {
            type: 'MemberExpression',

            object: {
              type: 'Identifier',
              name: 'Object',
            },

            property: {
              type: 'Identifier',
              name: 'assign',
            },

            computed: false,
            optional: false,
          },

          arguments: [
            {
              type: 'ObjectExpression',

              properties: [
                {
                  type: 'Property',

                  key: {
                    type: 'Identifier',
                    name: 'x',
                  },

                  value: {
                    type: 'Literal',
                    value: 1,
                  },
                },
              ],
            },
            {
              type: 'Identifier',
              name: 'a',
            },
          ],

          optional: false,
        },
        rule.pattern,
      ),
    ).toBeNull()
  })

  it('rejects Object.assign() with no arguments', () => {
    expect(
      match(
        {
          type: 'CallExpression',

          callee: {
            type: 'MemberExpression',

            object: {
              type: 'Identifier',
              name: 'Object',
            },

            property: {
              type: 'Identifier',
              name: 'assign',
            },

            computed: false,
            optional: false,
          },

          arguments: [],
          optional: false,
        },
        rule.pattern,
      ),
    ).toBeNull()
  })
})
