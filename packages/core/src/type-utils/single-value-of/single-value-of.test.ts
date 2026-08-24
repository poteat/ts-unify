import AssertType from '@/test-utils/assert-type'

import type { SingleValueOf } from './single-value-of'

describe('SingleValueOf', () => {
  it('yields the only value type for single-key objects', () => {
    type V = SingleValueOf<{ a: 1 }>
    AssertType.assertType<V, 1>(0)
  })

  it('yields never for multi-key objects', () => {
    type V = SingleValueOf<{ a: 1; b: 2 }>
    AssertType.assertType<V, never>(0)
  })

  it('yields never for empty objects and non-objects', () => {
    type V1 = SingleValueOf<{}>
    type V2 = SingleValueOf<string>
    AssertType.assertType<V1, never>(0)
    AssertType.assertType<V2, never>(0)
  })
})
