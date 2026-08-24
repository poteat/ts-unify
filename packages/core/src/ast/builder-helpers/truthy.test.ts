import AssertType from '@/test-utils/assert-type'

import type { Truthy } from './truthy'

describe('truthy', () => {
  it('excludes falsy primitives from unions', () => {
    type T = string | 0 | 0n | '' | null | undefined | false
    type R = Truthy<T>
    AssertType.assertType<R, string>(0)
  })
})
