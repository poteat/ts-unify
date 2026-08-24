import type { TSESTree } from '@typescript-eslint/types'

import type { ExtractCaptures } from '@/pattern'
import AssertType from '@/test-utils/assert-type'

import { arrayFromMapToArrayFrom } from './array-from-map-to-array-from'

describe('array-from-map-to-array-from', () => {
  it('captures the iterable and mapFn arguments', () => {
    type Bag = ExtractCaptures<(typeof arrayFromMapToArrayFrom)['from']>
    AssertType.assertType<
      Bag,
      {
        iterable: TSESTree.Expression | TSESTree.SpreadElement
        mapFn: TSESTree.Expression | TSESTree.SpreadElement
      }
    >(0)
  })
})
