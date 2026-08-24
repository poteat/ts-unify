import { brandStringPredicate } from './brand-string-predicate'

describe('brand-string-predicate', () => {
  it('is callable, and false for a non-string', () => {
    const long = brandStringPredicate(s => s.length > 2)
    expect(long('abc')).toBe(true)
    expect(long('ab')).toBe(false)
    expect(long(12345)).toBe(false)
  })
})
