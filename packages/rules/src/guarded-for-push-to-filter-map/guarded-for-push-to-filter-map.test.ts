import type { TSESTree } from '@typescript-eslint/types'

import type { ExtractCaptures } from '@/pattern'
import AssertType from '@/test-utils/assert-type'

import { guardedForPushToFilterMap } from './guarded-for-push-to-filter-map'

describe('guarded-for-push-to-filter-map', () => {
  it('captures the array by name, the loop, the guard and the consts', () => {
    type Bag = ExtractCaptures<(typeof guardedForPushToFilterMap)['from']>
    AssertType.assertType<
      Bag,
      {
        before: ReadonlyArray<TSESTree.Statement>
        after: ReadonlyArray<TSESTree.Statement>
        arrayName: string
        loopVar: TSESTree.BindingName
        source: TSESTree.Expression
        condition: TSESTree.Expression
        consts: ReadonlyArray<TSESTree.Statement>
        pushValue: TSESTree.CallExpressionArgument
      }
    >(0)
  })
})
