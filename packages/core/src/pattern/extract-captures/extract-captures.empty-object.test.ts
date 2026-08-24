import AssertType from '@/test-utils/assert-type'

import type { ExtractCaptures } from './extract-captures'

describe('ExtractCaptures with empty object', () => {
  it('treats {} as neutral (no captures) instead of never', () => {
    type Result = ExtractCaptures<{}>
    AssertType.assertType<Result, {}>(0)
  })
})
