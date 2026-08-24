import type { Overwrite } from '@/type-utils/overwrite'

/**
 * Asserts at compile time that `T` is assignable to `U`.
 *
 * The tests call it in both directions: the intersection `Overwrite`
 * produces is assignable each way to the flat shape, while an
 * exact-equality check on the two fails.
 */
const assertExtends = <T extends U, U>(_v?: T) => 0 as const

describe('overwrite', () => {
  it('overwrites colliding keys', () => {
    type A = { a: number }
    type B = { a: string }
    type R = Overwrite<A, B>
    assertExtends<R, { a: string }>()
    assertExtends<{ a: string }, R>()
  })

  it('adds new keys when no collision', () => {
    type A = { a: number }
    type B = { b: string }
    type R = Overwrite<A, B>
    assertExtends<R, { a: number; b: string }>()
    assertExtends<{ a: number; b: string }, R>()
  })
})
