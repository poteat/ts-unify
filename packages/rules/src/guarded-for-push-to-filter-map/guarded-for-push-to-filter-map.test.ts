import type { TSESTree } from '@typescript-eslint/types'

import type { ExtractCaptures } from '@/pattern'
import AssertType from '@/test-utils/assert-type'

import { guardedForPushToFilterMap } from './guarded-for-push-to-filter-map'

describe('guarded-for-push-to-filter-map', () => {
  it('captures all loop and array components', () => {
    type Bag = ExtractCaptures<(typeof guardedForPushToFilterMap)['from']>
    AssertType.assertType<
      Bag,
      {
        before: ReadonlyArray<TSESTree.Statement>
        after: ReadonlyArray<TSESTree.Statement>
        arrayId: TSESTree.BindingName
        loopVar: TSESTree.BindingName
        source: TSESTree.Expression
        condition: TSESTree.Expression
        pushValue: TSESTree.Expression | TSESTree.SpreadElement
      }
    >(0)
  })
})
