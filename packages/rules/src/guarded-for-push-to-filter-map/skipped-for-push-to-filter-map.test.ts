import type { TSESTree } from '@typescript-eslint/types'

import type { ExtractCaptures } from '@/pattern'
import AssertType from '@/test-utils/assert-type'

import { skippedForPushToFilterMap } from './skipped-for-push-to-filter-map'

describe('skipped-for-push-to-filter-map', () => {
  it('captures the array by name, the loop, the skip and the consts', () => {
    type Bag = ExtractCaptures<(typeof skippedForPushToFilterMap)['from']>
    AssertType.assertType<
      Bag,
      {
        before: ReadonlyArray<TSESTree.Statement>
        after: ReadonlyArray<TSESTree.Statement>
        arrayName: string
        loopVar: TSESTree.BindingName
        source: TSESTree.Expression
        skipped: TSESTree.Expression
        consts: ReadonlyArray<TSESTree.Statement>
        pushValue: TSESTree.CallExpressionArgument
      }
    >(0)
  })
})
