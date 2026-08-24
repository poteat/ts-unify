import AssertType from '@/test-utils/assert-type'

import type { Prettify } from './prettify'

describe('prettify', () => {
  it('should flatten intersection types', () => {
    type Intersected = { a: 1 } & { b: 2 }
    type Result = Prettify<Intersected>
    AssertType.assertType<Result, { a: 1; b: 2 }>(0)
  })

  it('should preserve single object types', () => {
    type Single = { a: 1; b: 2 }
    type Result = Prettify<Single>
    AssertType.assertType<Result, { a: 1; b: 2 }>(0)
  })

  it('should handle multiple intersections', () => {
    type A = { a: 1 }
    type B = { b: 2 }
    type C = { c: 3 }
    type Result = Prettify<A & B & C>
    AssertType.assertType<Result, { a: 1; b: 2; c: 3 }>(0)
  })
})
