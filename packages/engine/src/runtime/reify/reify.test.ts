import TestUtils from '../../test-utils'
import { reify } from './reify'

describe('reify', () => {
  it('converts a proxy node to a plain ESTree object', () => {
    expect(
      reify(
        TestUtils.makeProxy({
          tag: 'Identifier',

          args: [
            {
              name: 'x',
            },
          ],

          chain: [],
        }),
      ) as Record<string, unknown>,
    ).toEqual({
      type: 'Identifier',
      name: 'x',
    })
  })

  it('recursively reifies nested proxy nodes', () => {
    expect(
      reify(
        TestUtils.makeProxy({
          tag: 'ReturnStatement',

          args: [
            {
              argument: TestUtils.makeProxy({
                tag: 'Identifier',

                args: [
                  {
                    name: 'y',
                  },
                ],

                chain: [],
              }),
            },
          ],

          chain: [],
        }),
      ) as Record<string, unknown>,
    ).toEqual({
      type: 'ReturnStatement',

      argument: {
        type: 'Identifier',
        name: 'y',
      },
    })
  })

  it('reifies arrays of proxy nodes', () => {
    expect(
      reify([
        TestUtils.makeProxy({
          tag: 'Literal',

          args: [
            {
              value: 42,
            },
          ],

          chain: [],
        }),
        'plain',
      ]),
    ).toEqual([
      {
        type: 'Literal',
        value: 42,
      },
      'plain',
    ])
  })

  it('passes through primitives unchanged', () => {
    expect(reify(42)).toBe(42)
    expect(reify('hello')).toBe('hello')
    expect(reify(null)).toBeNull()
    expect(reify(undefined)).toBeUndefined()
    expect(reify(true)).toBe(true)
  })

  it('ignores type field from args (uses tag instead)', () => {
    const result = reify(
      TestUtils.makeProxy({
        tag: 'Identifier',

        args: [
          {
            type: 'ShouldBeIgnored',
            name: 'z',
          },
        ],

        chain: [],
      }),
    ) as Record<string, unknown>

    expect(result.type).toBe('Identifier')
    expect(result.name).toBe('z')
  })

  it('handles a proxy with no args', () => {
    expect(
      reify(
        TestUtils.makeProxy({
          tag: 'EmptyStatement',
          args: [],
          chain: [],
        }),
      ) as Record<string, unknown>,
    ).toEqual({
      type: 'EmptyStatement',
    })
  })
})
