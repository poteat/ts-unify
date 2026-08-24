import type { Capture } from '@/capture/capture-type'
import AssertType from '@/test-utils/assert-type'

import type { HasManyCaptures } from './has-many-captures'

describe('has-many-captures', () => {
  it('returns true for two or more captures', () => {
    type Node = { a: Capture<'x'>; b: Capture<'y'> }
    AssertType.assertType<HasManyCaptures<Node>, true>(0)
  })

  it('returns false for zero captures', () => {
    type Node = { type: 'Identifier'; name: 'foo' }
    AssertType.assertType<HasManyCaptures<Node>, false>(0)
  })

  it('returns false for a single capture', () => {
    type Node = { type: 'ReturnStatement'; argument: Capture<'arg'> }
    AssertType.assertType<HasManyCaptures<Node>, false>(0)
  })
})
