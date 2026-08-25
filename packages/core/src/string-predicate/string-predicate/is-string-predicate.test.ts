import Branding from './branding'
import { isStringPredicate } from './is-string-predicate'

describe('is-string-predicate', () => {
  it('recognises a branded predicate and a RegExp, nothing else', () => {
    expect(isStringPredicate(/a/)).toBe(true)
    expect(isStringPredicate(Branding.brandStringPredicate(() => true))).toBe(
      true,
    )
    expect(isStringPredicate(() => true)).toBe(false)
    expect(isStringPredicate('a')).toBe(false)
    expect(isStringPredicate(null)).toBe(false)
  })
})
