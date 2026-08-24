import type { TSESTree } from '@typescript-eslint/types'

import type { CommentNode } from '@/ast/comment-node'
import type { NodeKind } from '@/ast/node-kind'
import AssertType from '@/test-utils/assert-type'

import type { NodeByKind } from './node-by-kind'

describe('node-by-kind', () => {
  it('indexes concrete node interfaces by kind', () => {
    type IfNode = NodeByKind['IfStatement']
    type IdNode = NodeByKind['Identifier']
    type LitNode = NodeByKind['Literal']

    AssertType.assertType<IfNode, TSESTree.IfStatement>(0)
    AssertType.assertType<IdNode, TSESTree.Identifier>(0)
    AssertType.assertType<LitNode, TSESTree.Literal>(0)
    AssertType.assertType<NodeByKind['Comment'], CommentNode>(0)
    AssertType.assertType<
      NonNullable<NodeByKind['Program']['comments']>,
      CommentNode[]
    >(0)
  })

  it('is keyed by NodeKind', () => {
    type Keys = keyof NodeByKind
    AssertType.assertType<Keys, NodeKind>(0)
  })
})
