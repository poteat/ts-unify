import type { TSESTree } from '@typescript-eslint/types'

import type { ExtractCaptures } from '@/pattern'
import AssertType from '@/test-utils/assert-type'

import { collapseNullGuard } from './collapse-null-guard'

describe('collapse-null-guard', () => {
  it('captures body, value, fallback, and typeAnnotation', () => {
    type Bag = ExtractCaptures<(typeof collapseNullGuard)['from']>
    AssertType.assertType<
      Bag,
      {
        body: ReadonlyArray<TSESTree.Statement>
        value: TSESTree.Expression & (TSESTree.Expression | null)
        fallback: TSESTree.Expression
        typeAnnotation: TSESTree.TypeNode
      }
    >(0)
  })
})
