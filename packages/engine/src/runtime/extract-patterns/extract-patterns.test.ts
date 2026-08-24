import { U } from '@ts-unify/core'
import { NODE } from '@ts-unify/core/internal'
import type { ProxyNode } from '@ts-unify/core/internal'

import { extractPatterns } from './extract-patterns'

/**
 * Helper: create a minimal proxy-shaped function carrying a NODE descriptor.
 */
function makeProxy(node: ProxyNode): unknown {
  function fn() {}

  ;(fn as any)[NODE] = node

  return fn
}

function fn() {}

const guard = () => true

const branchGuard = () => true

describe('extractPatterns', () => {
  it('returns an empty array for non-proxy values', () => {
    expect(extractPatterns(42)).toEqual([])
    expect(extractPatterns({})).toEqual([])
  })

  it('extracts a single-node pattern', () => {
    const result = extractPatterns(
      makeProxy({
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
      makeProxy({
        tag: 'or',

        args: [
          makeProxy({
            tag: 'ReturnStatement',

            args: [
              {
                argument: 'cap',
              },
            ],

            chain: [],
          }),
          makeProxy({
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
      makeProxy({
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
    ;(fn as any)[NODE] = { tag: '', args: [], chain: [] }
    expect(extractPatterns(fn)).toEqual([])
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
        makeProxy({
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
      (U as any).or(
        (U as any).VariableDeclaration({
          kind: 'let',
        }),
        (U as any).VariableDeclaration({
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

  it(
    "appends a root or's .when(), .where() and .config() to each branch " +
      'chain',
    () => {
      const result = extractPatterns(
        (U as any)
          .or((U as any).Identifier().when(branchGuard), (U as any).Literal())
          .when(guard)
          .message('m'),
      )

      expect(result[0].chain.map(c => c.method)).toEqual(['when', 'when'])
      expect(result[0].chain[0].args[0]).toBe(branchGuard)
      expect(result[0].chain[1].args[0]).toBe(guard)
      expect(result[1].chain.map(c => c.method)).toEqual(['when'])
    },
  )
})
