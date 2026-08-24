import { regex } from './regex'

describe('regex', () => {
  it('wraps a RegExp and resets a global one between tests', () => {
    const re = regex(/a/g)
    expect(re('a')).toBe(true)
    expect(re('a')).toBe(true)
    expect(re('b')).toBe(false)
  })
})
