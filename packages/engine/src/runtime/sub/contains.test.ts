import { contains } from './contains'

describe('contains', () => {
  it('finds a node in a nested tree', () => {
    expect(
      contains(
        {
          type: 'ReturnStatement',

          argument: {
            type: 'Identifier',
            name: 'x',
          },
        },
        {
          type: 'Identifier',
          name: 'x',
        },
      ),
    ).toBe(true)
  })

  it('returns false when not found', () => {
    expect(
      contains(
        {
          type: 'ReturnStatement',

          argument: {
            type: 'Identifier',
            name: 'y',
          },
        },
        {
          type: 'Identifier',
          name: 'x',
        },
      ),
    ).toBe(false)
  })

  it('matches the root itself', () => {
    expect(
      contains(
        { type: 'Identifier', name: 'x' },
        { type: 'Identifier', name: 'x' },
      ),
    ).toBe(true)
  })

  it('searches arrays', () => {
    expect(
      contains(
        [
          {
            type: 'Literal',
            value: 1,
          },
          {
            type: 'Identifier',
            name: 'x',
          },
        ],
        {
          type: 'Identifier',
          name: 'x',
        },
      ),
    ).toBe(true)
  })

  it('ignores loc/range during comparison', () => {
    expect(
      contains(
        {
          type: 'Identifier',
          name: 'x',

          loc: {
            start: {
              line: 1,
            },
          },

          range: [0, 1],
        },
        {
          type: 'Identifier',
          name: 'x',
        },
      ),
    ).toBe(true)
  })

  it('returns false for primitives', () => {
    expect(contains(42, { type: 'X' })).toBe(false)
    expect(contains(null, { type: 'X' })).toBe(false)
  })
})
