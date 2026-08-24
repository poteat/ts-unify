import { U, $ } from '@'
import type { ExtractCaptures } from '@/pattern'
import StringPredicate from '@/string-predicate'
import AssertType from '@/test-utils/assert-type'

describe('u', () => {
  it('is served as a plain value from the root', () => {
    expect(typeof U.string).toBe('object')
    expect(typeof U.string.reserved).toBe('function')
    expect(StringPredicate.isStringPredicate(U.string.reserved())).toBe(true)
    expect(StringPredicate.isStringPredicate(U.string.identifierName())).toBe(
      true,
    )
    expect(StringPredicate.isStringPredicate(U.string.regex(/a/))).toBe(true)
    expect(StringPredicate.isStringPredicate(U.string.not(/a/))).toBe(true)
  })

  it('is accepted in a string slot and contributes no capture', () => {
    const p = U.Identifier({ name: U.string.reserved() })
    type Bag = ExtractCaptures<typeof p>
    AssertType.assertType<Bag, {}>(0)
    const q = U.Property({
      key: U.Identifier({ name: U.string.identifierName() }),
      value: $('v'),
    })
    type BagQ = ExtractCaptures<typeof q>
    AssertType.assertType<keyof BagQ, 'v'>(0)
    expect(typeof p).toBe('function')
    expect(typeof q).toBe('function')
  })

  it('narrows a captured value when called', () => {
    const key: string | number | null = Math.random() > 2 ? 1 : 'k'
    if (U.string.identifierName()(key) && !U.string.reserved()(key))
      expect(key.length).toBe(1)
  })
})
