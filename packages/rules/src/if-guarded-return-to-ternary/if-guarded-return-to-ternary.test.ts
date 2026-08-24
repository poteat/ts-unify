import type { TSESTree } from '@typescript-eslint/types'

import type { ExtractCaptures } from '@/pattern'
import AssertType from '@/test-utils/assert-type'

import { ifGuardedReturnToTernary } from './if-guarded-return-to-ternary'

describe('if-guarded-return-to-ternary', () => {
  it('captures body spread, test, sealed consequent, and alternate', () => {
    type Bag = ExtractCaptures<(typeof ifGuardedReturnToTernary)['from']>
    AssertType.assertType<
      Bag,
      {
        body: ReadonlyArray<TSESTree.Statement>
        test: TSESTree.Expression
        consequent: TSESTree.Expression
        alternate: TSESTree.Expression
      }
    >(0)
  })
})
