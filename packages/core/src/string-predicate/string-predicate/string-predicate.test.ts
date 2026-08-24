import {
  isStringPredicate,
  not,
  regex,
  stringPredicate,
  testString,
} from './string-predicate'

describe('string predicates', () => {
  it('recognises a branded predicate and a RegExp, nothing else', () => {
    expect(isStringPredicate(/a/)).toBe(true)
    expect(isStringPredicate(stringPredicate(() => true))).toBe(true)
    expect(isStringPredicate(() => true)).toBe(false)
    expect(isStringPredicate('a')).toBe(false)
    expect(isStringPredicate(null)).toBe(false)
  })

  it('is callable, and false for a non-string', () => {
    const long = stringPredicate(s => s.length > 2)
    expect(long('abc')).toBe(true)
    expect(long('ab')).toBe(false)
    expect(long(12345)).toBe(false)
    expect(testString(long, 'abc')).toBe(true)
    expect(testString(/4/, 42)).toBe(false)
  })

  it('wraps a RegExp and resets a global one between tests', () => {
    const re = regex(/a/g)
    expect(re('a')).toBe(true)
    expect(re('a')).toBe(true)
    expect(re('b')).toBe(false)
    expect(testString(/a/g, 'a')).toBe(true)
    expect(testString(/a/g, 'a')).toBe(true)
  })

  it('negates a predicate or a RegExp', () => {
    expect(not(/^a/)('b')).toBe(true)
    expect(not(/^a/)('a')).toBe(false)
    expect(not(stringPredicate(s => s === 'x'))('y')).toBe(true)
    expect(not(/a/)(1)).toBe(false)
  })
})
