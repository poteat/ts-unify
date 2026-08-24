import Capture from '@/capture'
import type { DollarObjectSpread, Spread } from '@/capture'
import AssertType from '@/test-utils/assert-type'

describe('$ object/sequence spread semantics', () => {
  it('typeof $ carries the DollarObjectSpread brand (type-level)', () => {
    type HasBrand = typeof Capture.$ extends DollarObjectSpread ? true : false
    AssertType.assertType<HasBrand, true>(0)
  })

  it('typeof $ is iterable over anonymous Spread tokens (type-level)', () => {
    type IterOK =
      typeof Capture.$ extends Iterable<Spread<'', unknown>> ? true : false
    AssertType.assertType<IterOK, true>(0)
  })

  it('spread in object context produces only the REST_CAPTURE marker', () => {
    const spread = { ...Capture.$ }
    expect(Object.keys(spread)).toEqual([])
    expect((spread as any)[Capture.REST_CAPTURE]).toBe(true)
  })

  it('spreading $ in sequences yields a single item at runtime', () => {
    const seq = [...Capture.$]
    expect(Array.isArray(seq)).toBe(true)
    expect(seq.length).toBe(1)
  })
})
