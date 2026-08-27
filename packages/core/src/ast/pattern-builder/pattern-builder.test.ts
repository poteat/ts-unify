import { AST_NODE_TYPES } from '@typescript-eslint/types'
import type { TSESTree } from '@typescript-eslint/types'

import type { PatternBuilder, NodeKind, NodeByKind } from '@/ast'
import BuilderMap from '@/ast/builder-map'
import type { UnwrapFluent } from '@/ast/unwrap-fluent'
import Capture from '@/capture'
import type { ExtractCaptures } from '@/pattern'
import AssertType from '@/test-utils/assert-type'

describe('pattern-builder', () => {
  it('nullary form returns discriminant only', () => {
    type B = PatternBuilder<'BlockStatement' & NodeKind>
    type HasNullary<T> = T extends {
      (): { type: NodeByKind['BlockStatement']['type'] }
    }
      ? true
      : false
    AssertType.assertType<HasNullary<B>, true>(0)
  })

  it('binds loc on a Comment pattern, and not on other kinds', () => {
    function check(u: BuilderMap.BuilderMap) {
      const c = u.Comment({ lines: Capture.$('lines'), loc: Capture.$('loc') })
      type CBag = ExtractCaptures<typeof c>
      AssertType.assertType<CBag['loc'], TSESTree.SourceLocation>(0)
      AssertType.assertType<CBag['lines'], string[]>(0)
      const i = u.Identifier({ loc: Capture.$('loc') })
      type IBag = ExtractCaptures<typeof i>
      AssertType.assertType<IBag['loc'], unknown>(0)
    }

    void check
  })

  describe('readonly shape', () => {
    it('binds a pattern to a readonly shape', () => {
      function check(u: BuilderMap.BuilderMap) {
        const p = u.Identifier({ name: Capture.$('n') })
        type Shape = UnwrapFluent<typeof p>
        AssertType.assertType<
          Shape,
          { readonly type: AST_NODE_TYPES.Identifier } & {
            readonly name: Capture.Capture<'n', string>
          }
        >(0)
        const bare = u.Identifier()
        AssertType.assertType<
          UnwrapFluent<typeof bare>,
          { readonly type: AST_NODE_TYPES.Identifier }
        >(0)
      }

      void check
    })

    it('keeps the capture bag writable', () => {
      function check(u: BuilderMap.BuilderMap) {
        const p = u.Identifier({ name: Capture.$('n') })
        AssertType.assertType<ExtractCaptures<typeof p>, { n: string }>(0)
      }

      void check
    })

    it('accepts Object.freeze around a builder call', () => {
      const frozen = Object.freeze(
        BuilderMap.U.Identifier({ name: Capture.$('n') }),
      )
      AssertType.assertType<ExtractCaptures<typeof frozen>, { n: string }>(0)
      const narrowed = frozen.when((n): n is 'x' => n === 'x')
      AssertType.assertType<ExtractCaptures<typeof narrowed>, { n: 'x' }>(0)
      const built = Object.freeze(BuilderMap.U.Identifier({ name: 'x' }))
      const bare = Object.freeze(BuilderMap.U.Identifier())
      expect(Object.isFrozen(frozen)).toBe(true)
      expect(Object.isFrozen(built)).toBe(true)
      expect(Object.isFrozen(bare)).toBe(true)
    })

    it('chains fluent helpers on a frozen pattern at runtime', () => {
      const frozen = Object.freeze(
        BuilderMap.U.Identifier({ name: Capture.$('n') }),
      )
      const narrowed = frozen.when((n): n is 'x' => n === 'x')
      expect(typeof narrowed).toBe('function')
      expect(narrowed).not.toBe(frozen)
    })
  })
})
