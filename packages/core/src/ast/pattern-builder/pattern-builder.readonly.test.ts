import { AST_NODE_TYPES } from '@typescript-eslint/types'

import type { BuilderMap } from '@/ast'
import AstBuilderMap from '@/ast/builder-map'
import type { UnwrapFluent } from '@/ast/unwrap-fluent'
import SrcCapture from '@/capture'
import type { Capture } from '@/capture'
import type { ExtractCaptures } from '@/pattern'
import AssertType from '@/test-utils/assert-type'

describe('PatternBuilder readonly shape', () => {
  it('binds a pattern to a readonly shape', () => {
    function check(u: BuilderMap) {
      const p = u.Identifier({ name: SrcCapture.$('n') })
      type Shape = UnwrapFluent<typeof p>
      AssertType.assertType<
        Shape,
        { readonly type: AST_NODE_TYPES.Identifier } & {
          readonly name: Capture<'n', string>
        }
      >(0)
      const any = u.Identifier()
      AssertType.assertType<
        UnwrapFluent<typeof any>,
        { readonly type: AST_NODE_TYPES.Identifier }
      >(0)
    }

    void check
  })

  it('keeps the capture bag writable', () => {
    function check(u: BuilderMap) {
      const p = u.Identifier({ name: SrcCapture.$('n') })
      AssertType.assertType<ExtractCaptures<typeof p>, { n: string }>(0)
    }

    void check
  })

  it('accepts Object.freeze around a builder call', () => {
    const frozen = Object.freeze(
      AstBuilderMap.U.Identifier({ name: SrcCapture.$('n') }),
    )
    AssertType.assertType<ExtractCaptures<typeof frozen>, { n: string }>(0)
    const narrowed = frozen.when((n): n is 'x' => n === 'x')
    AssertType.assertType<ExtractCaptures<typeof narrowed>, { n: 'x' }>(0)
    const built = Object.freeze(AstBuilderMap.U.Identifier({ name: 'x' }))
    const any = Object.freeze(AstBuilderMap.U.Identifier())
    expect(Object.isFrozen(frozen)).toBe(true)
    expect(Object.isFrozen(built)).toBe(true)
    expect(Object.isFrozen(any)).toBe(true)
  })

  it('chains fluent helpers on a frozen pattern at runtime', () => {
    const frozen = Object.freeze(
      AstBuilderMap.U.Identifier({ name: SrcCapture.$('n') }),
    )
    const narrowed = frozen.when((n): n is 'x' => n === 'x')
    expect(typeof narrowed).toBe('function')
    expect(narrowed).not.toBe(frozen)
  })
})
