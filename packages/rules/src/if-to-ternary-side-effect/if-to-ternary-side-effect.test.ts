import type { TSESTree } from '@typescript-eslint/types'

import type { ExtractCaptures } from '@/pattern'
import AssertType from '@/test-utils/assert-type'

import { ifToTernarySideEffect } from './if-to-ternary-side-effect'

describe('if-to-ternary-side-effect', () => {
  it('captures test, consequent, and alternate', () => {
    type Bag = ExtractCaptures<(typeof ifToTernarySideEffect)['from']>
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
