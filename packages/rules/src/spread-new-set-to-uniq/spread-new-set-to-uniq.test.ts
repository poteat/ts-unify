import type { TSESTree } from '@typescript-eslint/types'

import type { ExtractCaptures } from '@/pattern'
import AssertType from '@/test-utils/assert-type'

import { spreadNewSetToUniq } from './spread-new-set-to-uniq'

describe('spreadNewSetToUniq (type-level)', () => {
  it('captures the array argument', () => {
    type Bag = ExtractCaptures<(typeof spreadNewSetToUniq)['from']>
    AssertType.assertType<
      Bag,
      { array: TSESTree.Expression | TSESTree.SpreadElement }
    >(0)
  })
})
