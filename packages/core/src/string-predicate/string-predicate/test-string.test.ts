import { brandStringPredicate } from './brand-string-predicate'
import { testString } from './test-string'

describe('test-string', () => {
  it('applies a predicate, and is false for a non-string', () => {
    expect(
      testString(
        brandStringPredicate(s => s.length > 2),
        'abc',
      ),
    ).toBe(true)
    expect(testString(/4/, 42)).toBe(false)
  })

  it('applies a global RegExp the same way twice', () => {
    expect(testString(/a/g, 'a')).toBe(true)
    expect(testString(/a/g, 'a')).toBe(true)
  })
})
