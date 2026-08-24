import { U, $ } from '@ts-unify/core/internal'

import TestUtils from '../../test-utils'
import Match from '../match'
import { applyRewrites } from './apply-rewrites'
import Fixtures from './fixtures'

const matched = (node: unknown, proxy: unknown) =>
  TestUtils.present(
    Match.matchWithSites(node, ...Fixtures.pat(proxy)),
    'the pattern to match the node',
  )

describe('apply-rewrites', () => {
  describe('concrete', () => {
    it('rewrites the subtree of an inner .to() with no outer .to()', () => {
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

      const result = matched(
        node,
        U.BlockStatement({
          body: [
            U.ExpressionStatement({
              expression: $('expr'),
            }).to(it =>
              U.ReturnStatement({
                argument: it.expr,
              }),
            ),
          ],
        }),
      )

      expect(result.sites.map(s => s.path)).toEqual([['body', 0]])
      expect(result.capturePaths.expr).toEqual(['body', 0, 'expression'])

      expect(applyRewrites(node, result.sites, result.capturePaths)).toEqual({
        type: 'BlockStatement',

        body: [
          {
            type: 'ReturnStatement',

            argument: {
              type: 'Literal',
              value: 5,
            },
          },
        ],
      })
    })

    it('outer .to() reads the captures an inner .to() rewrote', () => {
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

      const result = matched(
        node,
        U.BlockStatement({
          body: [
            U.ExpressionStatement({
              expression: U.Literal({
                value: $('v'),
              }).to(it =>
                U.Literal({
                  value: (it.v as number) + 1,
                }),
              ),
            }),
          ],
        }).to(it =>
          U.BlockStatement({
            body: [
              U.ReturnStatement({
                argument: U.Literal({
                  value: it.v as number,
                }),
              }),
            ],
          }),
        ),
      )

      expect(applyRewrites(node, result.sites, result.capturePaths)).toEqual({
        type: 'BlockStatement',

        body: [
          {
            type: 'ReturnStatement',

            argument: {
              type: 'Literal',

              value: {
                type: 'Literal',
                value: 8,
              },
            },
          },
        ],
      })
    })

    it('two sibling inner .to()s at disjoint positions both apply', () => {
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

      const result = matched(
        node,
        Fixtures.LOOSE_U.BlockStatement({
          body: [
            Fixtures.LOOSE_U.ExpressionStatement({
              expression: $('a'),
            }).to(() =>
              Fixtures.LOOSE_U.ReturnStatement({
                argument: Fixtures.LOOSE_U.Identifier({
                  name: 'A',
                }),
              }),
            ),
            Fixtures.LOOSE_U.ExpressionStatement({
              expression: $('b'),
            }).to(() =>
              Fixtures.LOOSE_U.ReturnStatement({
                argument: Fixtures.LOOSE_U.Identifier({
                  name: 'B',
                }),
              }),
            ),
          ],
        }),
      )

      expect(result.sites).toHaveLength(2)

      expect(
        applyRewrites(node, result.sites, result.capturePaths),
      ).toMatchObject({
        body: [
          {
            argument: {
              type: 'Identifier',
              name: 'A',
            },
          },
          {
            argument: {
              type: 'Identifier',
              name: 'B',
            },
          },
        ],
      })
    })

    it('when no .to() anywhere, returns null', () => {
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

      const result = matched(
        node,
        U.BlockStatement({
          body: [
            U.ExpressionStatement({
              expression: $('e'),
            }),
          ],
        }),
      )

      expect(result.sites).toHaveLength(0)
      expect(applyRewrites(node, result.sites, result.capturePaths)).toBeNull()
    })

    it('seq site rewrites a span of array elements', () => {
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

      const result = matched(
        node,
        U.BlockStatement({
          body: [
            ...$('before'),
            U.seq(
              U.ExpressionStatement({
                expression: U.Identifier({
                  name: 'a',
                }),
              }),
              U.ExpressionStatement({
                expression: U.Identifier({
                  name: 'b',
                }),
              }),
            ).to(() =>
              U.ExpressionStatement({
                expression: U.Identifier({
                  name: 'merged',
                }),
              }),
            ),
            ...$('after'),
          ],
        }),
      )

      expect(result.sites).toHaveLength(1)
      expect(result.sites[0].span).toBe(2)

      expect(
        applyRewrites(node, result.sites, result.capturePaths),
      ).toMatchObject({
        body: [
          { expression: { name: 'x' } },
          { expression: { name: 'merged' } },
          { expression: { name: 'y' } },
        ],
      })
    })
  })

  describe('properties', () => {
    it('identity-rewrite at an inner site preserves the subtree', () => {
      const rand = Fixtures.rng(Fixtures.PBT.seeds.identity)

      for (let i = 0; i < Fixtures.PBT.runs; i++) {
        const node = Fixtures.genBlock(rand, 1)

        const r = matched(
          node,
          U.BlockStatement({
            body: [
              U.ExpressionStatement({
                expression: $('e'),
              }).to(it =>
                U.ExpressionStatement({
                  expression: it.e,
                }),
              ),
            ],
          }),
        )

        expect(applyRewrites(node, r.sites, r.capturePaths)).toEqual(node)
      }
    })

    it('sibling rewrites commute: any visit order yields one tree', () => {
      const rand = Fixtures.rng(Fixtures.PBT.seeds.commute)

      for (let i = 0; i < Fixtures.PBT.runs; i++) {
        const node = Fixtures.genBlock(rand, 2)

        const proxy = Fixtures.LOOSE_U.BlockStatement({
          body: [
            Fixtures.LOOSE_U.ExpressionStatement({
              expression: $('a'),
            }).to(() =>
              Fixtures.LOOSE_U.ReturnStatement({
                argument: Fixtures.LOOSE_U.Identifier({
                  name: 'A',
                }),
              }),
            ),
            Fixtures.LOOSE_U.ExpressionStatement({
              expression: $('b'),
            }).to(() =>
              Fixtures.LOOSE_U.ReturnStatement({
                argument: Fixtures.LOOSE_U.Identifier({
                  name: 'B',
                }),
              }),
            ),
          ],
        })

        const r1 = matched(node, proxy)
        const r2 = matched(node, proxy)
        const a = applyRewrites(node, r1.sites, r1.capturePaths)
        const b = applyRewrites(node, [...r2.sites].reverse(), r2.capturePaths)
        expect(a).toEqual(b)
      }
    })

    it('a nested .to(g) equals an outer .to() that applies g itself', () => {
      const rand = Fixtures.rng(Fixtures.PBT.seeds.fused)
      const nestedProxy = Fixtures.LOOSE_U.BlockStatement({
        body: [
          Fixtures.LOOSE_U.ExpressionStatement({
            expression: Fixtures.LOOSE_U.Literal({ value: $('v') }).to(
              Fixtures.identX,
            ),
          }),
        ],
      }).to(it =>
        Fixtures.LOOSE_U.BlockStatement({
          body: [
            Fixtures.LOOSE_U.ReturnStatement({
              argument: Fixtures.LOOSE_U.Literal({ value: it.v }),
            }),
          ],
        }),
      )

      const fusedProxy = Fixtures.LOOSE_U.BlockStatement({
        body: [
          Fixtures.LOOSE_U.ExpressionStatement({
            expression: Fixtures.LOOSE_U.Literal({ value: $('v') }),
          }),
        ],
      }).to(() =>
        Fixtures.LOOSE_U.BlockStatement({
          body: [
            Fixtures.LOOSE_U.ReturnStatement({
              argument: Fixtures.LOOSE_U.Literal({
                value: Fixtures.identX(),
              }),
            }),
          ],
        }),
      )

      for (let i = 0; i < Fixtures.PBT.runs; i++) {
        const node = {
          type: 'BlockStatement',

          body: [
            {
              type: 'ExpressionStatement',

              expression: {
                type: 'Literal',
                value: Math.floor(rand() * Fixtures.DRAWS.literalRange),
              },
            },
          ],
        }

        const nested = matched(node, nestedProxy)
        const fused = matched(node, fusedProxy)

        expect(applyRewrites(node, nested.sites, nested.capturePaths)).toEqual(
          applyRewrites(node, fused.sites, fused.capturePaths),
        )
      }
    })
  })
})
