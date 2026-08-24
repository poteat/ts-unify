import type { TSESTree } from '@typescript-eslint/types'

import type { ExtractCaptures } from '@/pattern'
import AssertType from '@/test-utils/assert-type'

import { addReturnToBlock } from './add-return-to-block'

describe('add-return-to-block', () => {
  it('captures the expression from the single expression statement', () => {
    type Bag = ExtractCaptures<typeof addReturnToBlock>
    AssertType.assertType<Bag, { expression: TSESTree.Expression }>(0)
  })
})
