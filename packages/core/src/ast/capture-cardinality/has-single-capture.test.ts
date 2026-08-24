import type { Capture } from '@/capture/capture-type'
import AssertType from '@/test-utils/assert-type'

import type { HasSingleCapture } from './has-single-capture'

describe('has-single-capture', () => {
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
