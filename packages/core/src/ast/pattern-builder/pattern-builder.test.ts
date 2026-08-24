import type { TSESTree } from '@typescript-eslint/types'

import type { PatternBuilder, NodeKind, NodeByKind, BuilderMap } from '@/ast'
import Capture from '@/capture'
import type { ExtractCaptures } from '@/pattern'
import AssertType from '@/test-utils/assert-type'

describe('PatternBuilder', () => {
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
    function check(u: BuilderMap) {
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
})
