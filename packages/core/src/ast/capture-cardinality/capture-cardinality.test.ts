import type { Capture } from '@/capture/capture-type'
import AssertType from '@/test-utils/assert-type'

import type {
  HasZeroCaptures,
  HasSingleCapture,
  HasManyCaptures,
} from './capture-cardinality'

describe('HasZeroCaptures', () => {
  it('returns true for a node with no captures', () => {
    type Node = { type: 'Identifier'; name: 'foo' }
    AssertType.assertType<HasZeroCaptures<Node>, true>(0)
  })

  it('returns false when a capture is present', () => {
    type Node = { type: 'ReturnStatement'; argument: Capture<'arg'> }
    AssertType.assertType<HasZeroCaptures<Node>, false>(0)
  })
})

describe('HasSingleCapture', () => {
  it('returns true for exactly one capture', () => {
    type Node = { type: 'ReturnStatement'; argument: Capture<'arg'> }
    AssertType.assertType<HasSingleCapture<Node>, true>(0)
  })

  it('returns false for zero captures', () => {
    type Node = { type: 'Identifier'; name: 'foo' }
    AssertType.assertType<HasSingleCapture<Node>, false>(0)
  })

  it('returns false for multiple captures', () => {
    type Node = { a: Capture<'x'>; b: Capture<'y'> }
    AssertType.assertType<HasSingleCapture<Node>, false>(0)
  })
})

describe('HasManyCaptures', () => {
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
