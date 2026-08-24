import type { TSESTree } from '@typescript-eslint/types'

import type { IsAstNode } from '@/ast/is-ast-node'
import AssertType from '@/test-utils/assert-type'

describe('is-ast-node', () => {
  it('is true for a concrete node and false otherwise', () => {
    AssertType.assertType<IsAstNode<TSESTree.Identifier>, true>(0)
    AssertType.assertType<IsAstNode<{ parent?: unknown }>, false>(0)
    AssertType.assertType<IsAstNode<string>, false>(0)
  })
})
