import type { TSESTree } from '@typescript-eslint/types'

import type { ExtractCaptures } from '@/pattern'
import AssertType from '@/test-utils/assert-type'

import { ifGuardedCallToOptional } from './if-guarded-call-to-optional'

describe('if-guarded-call-to-optional', () => {
  it('captures callee and args', () => {
    type Bag = ExtractCaptures<(typeof ifGuardedCallToOptional)['from']>
    AssertType.assertType<
      Bag,
      {
        callee: TSESTree.Expression
        args: TSESTree.CallExpressionArgument[]
      }
    >(0)
  })
})
