import type { TSESTree } from '@typescript-eslint/types'

import type { ExtractCaptures } from '@/pattern'
import AssertType from '@/test-utils/assert-type'

import { objectAssignToSpread } from './object-assign-to-spread'

describe('objectAssignToSpread (type-level)', () => {
  it('captures the spread sources', () => {
    type Bag = ExtractCaptures<(typeof objectAssignToSpread)['from']>
    AssertType.assertType<
      Bag,
      { sources: ReadonlyArray<TSESTree.Expression | TSESTree.SpreadElement> }
    >(0)
  })
})
