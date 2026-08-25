import type { Capture } from '@/capture/capture-type'
import AssertType from '@/test-utils/assert-type'

import type { HasZeroCaptures } from './has-zero-captures'

describe('has-zero-captures', () => {
  it('returns true for a node with no captures', () => {
    type Node = { type: 'Identifier'; name: 'foo' }
    AssertType.assertType<HasZeroCaptures<Node>, true>(0)
  })

  it('returns false when a capture is present', () => {
    type Node = { type: 'ReturnStatement'; argument: Capture<'arg'> }
    AssertType.assertType<HasZeroCaptures<Node>, false>(0)
  })
})
