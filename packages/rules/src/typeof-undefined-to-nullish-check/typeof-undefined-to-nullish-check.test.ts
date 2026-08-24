import type { TSESTree } from '@typescript-eslint/types'

import type { ExtractCaptures } from '@/pattern'
import AssertType from '@/test-utils/assert-type'

import { typeofUndefinedToNullishCheck } from './typeof-undefined-to-nullish-check'

describe('typeof-undefined-to-nullish-check', () => {
  it('captures the expression being checked', () => {
    type Bag = ExtractCaptures<(typeof typeofUndefinedToNullishCheck)['from']>
    AssertType.assertType<Bag, { expr: TSESTree.Expression }>(0)
  })
})
