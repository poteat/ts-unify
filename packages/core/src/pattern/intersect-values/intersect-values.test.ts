import AssertType from '@/test-utils/assert-type'

import type { IntersectValues } from './intersect-values'

describe('intersect-values', () => {
  it('intersects the bags an object holds', () => {
    type Result = IntersectValues<{ a: { x: 1 }; b: { y: 2 } }>
    AssertType.assertType<Result, { x: 1 } & { y: 2 }>(0)
  })

  it('gives an empty bag for an object with no properties', () => {
    type Result = IntersectValues<{}>
    AssertType.assertType<Result, {}>(0)
  })
})
