import type { TSESTree } from '@typescript-eslint/types'

import type { ExtractCaptures } from '@/pattern'
import AssertType from '@/test-utils/assert-type'

import { ifReturnToTernary } from './if-return-to-ternary'

describe('if-return-to-ternary', () => {
  it('captures test, consequent, and alternate', () => {
    type Bag = ExtractCaptures<(typeof ifReturnToTernary)['from']>
    AssertType.assertType<
      Bag,
      {
        test: TSESTree.Expression
        consequent: TSESTree.Expression
        alternate: TSESTree.Expression
      }
    >(0)
  })
})
