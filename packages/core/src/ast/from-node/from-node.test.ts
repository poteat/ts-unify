import { AST_NODE_TYPES } from '@typescript-eslint/types'

import type { BuilderMap, NodeByKind } from '@/ast'
import type { UnwrapFluent } from '@/ast/unwrap-fluent'
import AssertType from '@/test-utils/assert-type'

describe('from-node', () => {
  it('type-only input returns the discriminant only', () => {
    function check(U: BuilderMap) {
      const n = U.fromNode({ type: AST_NODE_TYPES.ReturnStatement })
      type Inner = UnwrapFluent<typeof n>
      AssertType.assertType<
        Inner,
        { readonly type: NodeByKind['ReturnStatement']['type'] }
      >(0)
    }

    void check
  })

  it('shape input returns concrete node type', () => {
    function check(U: BuilderMap) {
      const n = U.fromNode({
        type: AST_NODE_TYPES.ReturnStatement,
        argument: null,
      })
      type Inner = UnwrapFluent<typeof n>
      AssertType.assertType<Inner, NodeByKind['ReturnStatement']>(0)
    }

    void check
  })
})
