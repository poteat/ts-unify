import Branding from './branding'
import { not } from './not'

describe('not', () => {
  it('negates a predicate or a RegExp', () => {
    expect(not(/^a/)('b')).toBe(true)
    expect(not(/^a/)('a')).toBe(false)
    expect(not(Branding.brandStringPredicate(s => s === 'x'))('y')).toBe(true)
    expect(not(/a/)(1)).toBe(false)
  })
})
