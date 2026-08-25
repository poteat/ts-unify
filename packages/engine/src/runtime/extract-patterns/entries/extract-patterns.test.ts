import { U } from '@ts-unify/core'

import TestUtils from '../../../test-utils'
import Fixtures from '../fixtures'
import { extractPatterns } from './extract-patterns'

describe('extract-patterns', () => {
  it('returns an empty array for non-proxy values', () => {
    expect(extractPatterns(42)).toEqual([])
    expect(extractPatterns({})).toEqual([])
  })

  it('extracts a single-node pattern', () => {
    const result = extractPatterns(
      TestUtils.makeProxy({
        tag: 'Identifier',

        args: [
          {
            name: 'foo',
          },
        ],

        chain: [],
      }),
    )

    expect(result).toHaveLength(1)
    expect(result[0].tag).toBe('Identifier')

    expect(result[0].pattern).toEqual({
      name: 'foo',
    })
  })

  it('extracts patterns from an or() disjunction', () => {
    const result = extractPatterns(
      TestUtils.makeProxy({
        tag: 'or',

        args: [
          TestUtils.makeProxy({
            tag: 'ReturnStatement',

            args: [
              {
                argument: 'cap',
              },
            ],

            chain: [],
          }),
          TestUtils.makeProxy({
            tag: 'ThrowStatement',

            args: [
              {
                argument: 'cap2',
              },
            ],

            chain: [],
          }),
        ],

        chain: [],
      }),
    )

    expect(result).toHaveLength(2)
    expect(result[0].tag).toBe('ReturnStatement')
    expect(result[1].tag).toBe('ThrowStatement')
  })

  it('extracts patterns from fromNode with string type', () => {
    const result = extractPatterns(
      TestUtils.makeProxy({
        tag: 'fromNode',

        args: [
          {
            type: 'IfStatement',
            test: 'cap',
          },
        ],

        chain: [],
      }),
    )

    expect(result).toHaveLength(1)
    expect(result[0].tag).toBe('IfStatement')

    expect(result[0].pattern).toEqual({
      test: 'cap',
    })

    expect(result[0].pattern).not.toHaveProperty('type')
  })

  it('returns empty array when tag is missing', () => {
    expect(
      extractPatterns(TestUtils.makeProxy({ tag: '', args: [], chain: [] })),
    ).toEqual([])
  })

  it('preserves chain entries', () => {
    const chain = [
      {
        method: 'when',
        args: [() => true],
      },
    ]

    expect(
      extractPatterns(
        TestUtils.makeProxy({
          tag: 'Identifier',

          args: [
            {
              name: 'x',
            },
          ],

          chain,
        }),
      )[0].chain,
    ).toBe(chain)
  })

  it('keeps one entry per branch when branches share a tag', () => {
    const result = extractPatterns(
      U.or(
        U.VariableDeclaration({
          kind: 'let',
        }),
        U.VariableDeclaration({
          kind: 'var',
        }),
      ),
    )

    expect(result.map(e => e.tag)).toEqual([
      'VariableDeclaration',
      'VariableDeclaration',
    ])
    expect(result.map(e => e.pattern.kind)).toEqual(['let', 'var'])
  })

  it("appends a root or's guards and config to each branch chain", () => {
    const result = extractPatterns(
      U.or(U.Identifier().when(Fixtures.GUARDS.branch), U.Literal())
        .when(Fixtures.GUARDS.root)
        .message('m'),
    )

    expect(result[0].chain.map(c => c.method)).toEqual(['when', 'when'])
    expect(result[0].chain[0].args[0]).toBe(Fixtures.GUARDS.branch)
    expect(result[0].chain[1].args[0]).toBe(Fixtures.GUARDS.root)
    expect(result[1].chain.map(c => c.method)).toEqual(['when'])
  })
})
