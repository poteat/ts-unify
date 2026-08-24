import AssertType from '@/test-utils/assert-type'

import type { KeysToTuple } from './keys-to-tuple'

describe('keys-to-tuple', () => {
  it('should convert object keys to tuple', () => {
    type Obj = { a: 1; b: 2; c: 3 }
    type Result = KeysToTuple<Obj>
    type HasAllKeys = 'a' extends Result[number]
      ? 'b' extends Result[number]
        ? 'c' extends Result[number]
          ? true
          : false
        : false
      : false
    AssertType.assertType<HasAllKeys, true>(0)
  })

  it('should return empty tuple for non-object', () => {
    type Result = KeysToTuple<string>
    AssertType.assertType<Result, []>(0)
  })

  it('should handle empty object', () => {
    type Empty = {}
    type Result = KeysToTuple<Empty>
    AssertType.assertType<Result, []>(0)
  })

  it('should handle single key', () => {
    type Single = { isOnly: true }
    type Result = KeysToTuple<Single>
    AssertType.assertType<Result, ['isOnly']>(0)
  })
})
