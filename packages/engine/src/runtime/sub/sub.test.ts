import TestUtils from '../../test-utils'
import Fixtures from './fixtures'
import { sub } from './sub'

describe('sub', () => {
  it('replaces a structurally equal node and leaves the others', () => {
    const tree = Fixtures.call(TestUtils.identifier('handler'), [
      TestUtils.identifier('err'),
    ])
    const target = TestUtils.identifier('handler')
    const replacement = Fixtures.member(
      TestUtils.identifier('config'),
      TestUtils.identifier('onError'),
    )

    const result = sub(tree, target, replacement) as Record<string, unknown>
    expect(result.callee).toEqual(replacement)

    expect((result.arguments as unknown[])[0]).toEqual({
      type: 'Identifier',
      name: 'err',
    })
  })

  it('replaces multiple occurrences', () => {
    const result = sub(
      {
        type: 'BinaryExpression',

        left: {
          type: 'Identifier',
          name: 'x',
        },

        right: {
          type: 'Identifier',
          name: 'x',
        },
      },
      {
        type: 'Identifier',
        name: 'x',
      },
      {
        type: 'Literal',
        value: 1,
      },
    ) as Record<string, unknown>

    expect(result.left).toEqual({
      type: 'Literal',
      value: 1,
    })

    expect(result.right).toEqual({
      type: 'Literal',
      value: 1,
    })
  })

  it('does not replace non-matching nodes', () => {
    expect(
      sub(
        {
          type: 'Identifier',
          name: 'y',
        },
        {
          type: 'Identifier',
          name: 'x',
        },
        {
          type: 'Literal',
          value: 1,
        },
      ),
    ).toEqual({
      type: 'Identifier',
      name: 'y',
    })
  })

  it('handles arrays', () => {
    expect(
      sub(
        [
          {
            type: 'Identifier',
            name: 'x',
          },
          {
            type: 'Identifier',
            name: 'y',
          },
        ],
        {
          type: 'Identifier',
          name: 'x',
        },
        {
          type: 'Literal',
          value: 42,
        },
      ),
    ).toEqual([
      {
        type: 'Literal',
        value: 42,
      },
      {
        type: 'Identifier',
        name: 'y',
      },
    ])
  })

  it('returns primitives as-is', () => {
    expect(sub(42, { type: 'X' }, { type: 'Y' })).toBe(42)
    expect(sub('hello', { type: 'X' }, { type: 'Y' })).toBe('hello')
    expect(sub(null, { type: 'X' }, { type: 'Y' })).toBeNull()
  })

  it('does not mutate the original tree', () => {
    const tree = Fixtures.returnOf(TestUtils.identifier('x'))
    const original = JSON.stringify(tree)
    sub(tree, { type: 'Identifier', name: 'x' }, { type: 'Literal', value: 1 })
    expect(JSON.stringify(tree)).toBe(original)
  })

  it('ignores parent/loc/range during comparison', () => {
    expect(
      sub(
        {
          type: 'Identifier',
          name: 'x',

          loc: {
            start: {
              line: 1,
            },

            end: {
              line: 1,
            },
          },

          range: [0, 1],
        },
        {
          type: 'Identifier',
          name: 'x',
        },
        {
          type: 'Literal',
          value: 1,
        },
      ),
    ).toEqual({
      type: 'Literal',
      value: 1,
    })
  })

  it('replaces the root itself if it matches', () => {
    expect(
      sub(
        {
          type: 'Identifier',
          name: 'x',
        },
        {
          type: 'Identifier',
          name: 'x',
        },
        {
          type: 'Literal',
          value: 99,
        },
      ),
    ).toEqual({
      type: 'Literal',
      value: 99,
    })
  })
})
