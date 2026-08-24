import { U, NODE, $ } from '@ts-unify/core/internal'

import Match from '../match'

import { applyRewrites } from './apply-rewrites'

function pat(proxy: any) {
  const node = proxy[NODE]

  return { pattern: node.args[0] ?? {}, chain: node.chain }
}

describe('applyRewrites — concrete', () => {
  it(
    'inner .to() at a single sub-position rewrites that subtree (no outer ' +
      '.to())',
    () => {
      const { pattern, chain } = pat(
        (U as any).BlockStatement({
          body: [
            (U as any)
              .ExpressionStatement({
                expression: $('expr'),
              })
              .to((it: any) =>
                (U as any).ReturnStatement({
                  argument: it.expr,
                }),
              ),
          ],
        }),
      )

      const node = {
        type: 'BlockStatement',

        body: [
          {
            type: 'ExpressionStatement',

            expression: {
              type: 'Literal',
              value: 5,
            },
          },
        ],
      }

      const result = Match.matchWithSites(node, pattern, chain)
      expect(result).not.toBeNull()
      expect(result!.sites.map(s => s.path)).toEqual([['body', 0]])
      expect(result!.capturePaths.expr).toEqual(['body', 0, 'expression'])
      const rewritten = applyRewrites(
        node,
        result!.sites,
        result!.capturePaths,
      ) as any
      expect(rewritten.type).toBe('BlockStatement')
      expect(rewritten.body).toHaveLength(1)

      expect(rewritten.body[0]).toEqual({
        type: 'ReturnStatement',

        argument: {
          type: 'Literal',
          value: 5,
        },
      })
    },
  )

  it('outer .to() reads inner-rewritten captures (bottom-up rebinding)', () => {
    const { pattern, chain } = pat(
      (U as any)
        .BlockStatement({
          body: [
            (U as any).ExpressionStatement({
              expression: (U as any)
                .Literal({
                  value: $('v'),
                })
                .to((it: any) =>
                  (U as any).Literal({
                    value: (it.v as number) + 1,
                  }),
                ),
            }),
          ],
        })
        .to((it: any) =>
          (U as any).BlockStatement({
            body: [
              (U as any).ReturnStatement({
                argument: (U as any).Literal({
                  value: it.v,
                }),
              }),
            ],
          }),
        ),
    )

    const node = {
      type: 'BlockStatement',

      body: [
        {
          type: 'ExpressionStatement',

          expression: {
            type: 'Literal',
            value: 7,
          },
        },
      ],
    }

    const result = Match.matchWithSites(node, pattern, chain)
    expect(result).not.toBeNull()

    expect(
      (applyRewrites(node, result!.sites, result!.capturePaths) as any).body[0],
    ).toEqual({
      type: 'ReturnStatement',

      argument: {
        type: 'Literal',

        value: {
          type: 'Literal',
          value: 8,
        },
      },
    })
  })

  it('two sibling inner .to()s at disjoint positions both apply', () => {
    const { pattern, chain } = pat(
      (U as any).BlockStatement({
        body: [
          (U as any)
            .ExpressionStatement({
              expression: $('a'),
            })
            .to(() =>
              (U as any).ReturnStatement({
                argument: (U as any).Identifier({
                  name: 'A',
                }),
              }),
            ),
          (U as any)
            .ExpressionStatement({
              expression: $('b'),
            })
            .to(() =>
              (U as any).ReturnStatement({
                argument: (U as any).Identifier({
                  name: 'B',
                }),
              }),
            ),
        ],
      }),
    )

    const node = {
      type: 'BlockStatement',

      body: [
        {
          type: 'ExpressionStatement',

          expression: {
            type: 'Literal',
            value: 1,
          },
        },
        {
          type: 'ExpressionStatement',

          expression: {
            type: 'Literal',
            value: 2,
          },
        },
      ],
    }

    const result = Match.matchWithSites(node, pattern, chain)
    expect(result).not.toBeNull()
    expect(result!.sites).toHaveLength(2)
    const rewritten = applyRewrites(
      node,
      result!.sites,
      result!.capturePaths,
    ) as any

    expect(rewritten.body[0].argument).toEqual({
      type: 'Identifier',
      name: 'A',
    })

    expect(rewritten.body[1].argument).toEqual({
      type: 'Identifier',
      name: 'B',
    })
  })

  it('when no .to() anywhere, returns null', () => {
    const { pattern, chain } = pat(
      (U as any).BlockStatement({
        body: [
          (U as any).ExpressionStatement({
            expression: $('e'),
          }),
        ],
      }),
    )

    const node = {
      type: 'BlockStatement',

      body: [
        {
          type: 'ExpressionStatement',

          expression: {
            type: 'Identifier',
            name: 'x',
          },
        },
      ],
    }

    const result = Match.matchWithSites(node, pattern, chain)
    expect(result).not.toBeNull()
    expect(result!.sites).toHaveLength(0)
    expect(applyRewrites(node, result!.sites, result!.capturePaths)).toBeNull()
  })

  it('seq site rewrites a span of array elements', () => {
    const { pattern, chain } = pat(
      (U as any).BlockStatement({
        body: [
          ...$('before'),
          (U as any)
            .seq(
              (U as any).ExpressionStatement({
                expression: (U as any).Identifier({
                  name: 'a',
                }),
              }),
              (U as any).ExpressionStatement({
                expression: (U as any).Identifier({
                  name: 'b',
                }),
              }),
            )
            .to(() =>
              (U as any).ExpressionStatement({
                expression: (U as any).Identifier({
                  name: 'merged',
                }),
              }),
            ),
          ...$('after'),
        ],
      }),
    )

    const node = {
      type: 'BlockStatement',

      body: [
        {
          type: 'ExpressionStatement',

          expression: {
            type: 'Identifier',
            name: 'x',
          },
        },
        {
          type: 'ExpressionStatement',

          expression: {
            type: 'Identifier',
            name: 'a',
          },
        },
        {
          type: 'ExpressionStatement',

          expression: {
            type: 'Identifier',
            name: 'b',
          },
        },
        {
          type: 'ExpressionStatement',

          expression: {
            type: 'Identifier',
            name: 'y',
          },
        },
      ],
    }

    const result = Match.matchWithSites(node, pattern, chain)
    expect(result).not.toBeNull()
    expect(result!.sites).toHaveLength(1)
    expect(result!.sites[0].span).toBe(2)

    expect(
      (
        applyRewrites(node, result!.sites, result!.capturePaths) as any
      ).body.map((s: any) => s.expression.name),
    ).toEqual(['x', 'merged', 'y'])
  })
})

// ─── PBT-style properties ──────────────────────────────────────────────────

/**
 * Tiny seeded PRNG (xorshift32) — failures are reproducible.
 */
function rng(seed: number) {
  let s = seed | 0 || 1

  return () => {
    s ^= s << 13
    s ^= s >>> 17
    s ^= s << 5

    return ((s >>> 0) % 1_000_000) / 1_000_000
  }
}

const genIdent = (rand: () => number) => ({
  type: 'Identifier',
  name: ['a', 'b', 'c', 'd', 'e'][Math.floor(rand() * 5)],
})

const genExpr = (rand: () => number) =>
  rand() < 0.5
    ? {
        type: 'Literal',
        value: Math.floor(rand() * 100),
      }
    : genIdent(rand)

const genBlock = (rand: () => number, n: number) => ({
  type: 'BlockStatement',

  body: Array.from(
    {
      length: n,
    },
    () => ({
      type: 'ExpressionStatement',
      expression: genExpr(rand),
    }),
  ),
})

const g = () => (U as any).Identifier({ name: 'X' })

describe('applyRewrites — PBT properties', () => {
  it('identity-rewrite at an inner site preserves the subtree', () => {
    // Pattern wraps each ExpressionStatement with .to() returning itself.
    // Result must equal the cloned input (modulo metadata stripped by clone).
    const rand = rng(42)

    for (let i = 0; i < 50; i++) {
      const node = genBlock(rand, 1)

      const { pattern, chain } = pat(
        (U as any).BlockStatement({
          body: [
            (U as any)
              .ExpressionStatement({
                expression: $('e'),
              })
              .to((it: any) =>
                (U as any).ExpressionStatement({
                  expression: it.e,
                }),
              ),
          ],
        }),
      )

      const r = Match.matchWithSites(node, pattern, chain)!
      expect(
        (applyRewrites(node, r.sites, r.capturePaths) as any).body[0],
      ).toEqual(node.body[0])
    }
  })

  it('sibling rewrites commute (any visit order yields the same tree)', () => {
    const rand = rng(7)

    for (let i = 0; i < 50; i++) {
      const node = genBlock(rand, 2)

      const { pattern, chain } = pat(
        (U as any).BlockStatement({
          body: [
            (U as any)
              .ExpressionStatement({
                expression: $('a'),
              })
              .to(() =>
                (U as any).ReturnStatement({
                  argument: (U as any).Identifier({
                    name: 'A',
                  }),
                }),
              ),
            (U as any)
              .ExpressionStatement({
                expression: $('b'),
              })
              .to(() =>
                (U as any).ReturnStatement({
                  argument: (U as any).Identifier({
                    name: 'B',
                  }),
                }),
              ),
          ],
        }),
      )

      const r1 = Match.matchWithSites(node, pattern, chain)!
      const r2 = Match.matchWithSites(node, pattern, chain)!
      const a = applyRewrites(node, r1.sites, r1.capturePaths)
      const b = applyRewrites(node, [...r2.sites].reverse(), r2.capturePaths)
      expect(a).toEqual(b)
    }
  })

  it(
    'inline equivalence: nested .to(g) ≡ outer .to(b => f({...b, expr: ' +
      'g(b)}))',
    () => {
      // For a fixed inner rewrite g (replace the literal with Identifier("X"))
      // and outer rewrite f (wrap in ReturnStatement), assert the nested
      // declaration matches a hand-fused single-rewrite declaration on every
      // random input.
      const rand = rng(99)

      const nestedProxy = (U as any)
        .BlockStatement({
          body: [
            (U as any).ExpressionStatement({
              expression: (U as any).Literal({ value: $('v') }).to(g),
            }),
          ],
        })
        .to((it: any) =>
          (U as any).BlockStatement({
            body: [
              (U as any).ReturnStatement({
                argument: (U as any).Literal({ value: it.v }),
              }),
            ],
          }),
        )

      const fusedProxy = (U as any)
        .BlockStatement({
          body: [
            (U as any).ExpressionStatement({
              expression: (U as any).Literal({ value: $('v') }),
            }),
          ],
        })
        .to(({ v: _v }: any) =>
          (U as any).BlockStatement({
            body: [
              (U as any).ReturnStatement({
                argument: (U as any).Literal({
                  value: g(),
                }),
              }),
            ],
          }),
        )

      for (let i = 0; i < 50; i++) {
        const node = {
          type: 'BlockStatement',
          body: [
            {
              type: 'ExpressionStatement',
              expression: { type: 'Literal', value: Math.floor(rand() * 100) },
            },
          ],
        }
        const a = (() => {
          const { pattern, chain } = pat(nestedProxy)
          const r = Match.matchWithSites(node, pattern, chain)!

          return applyRewrites(node, r.sites, r.capturePaths)
        })()
        const b = (() => {
          const { pattern, chain } = pat(fusedProxy)
          const r = Match.matchWithSites(node, pattern, chain)!

          return applyRewrites(node, r.sites, r.capturePaths)
        })()
        expect(a).toEqual(b)
      }
    },
  )
})
