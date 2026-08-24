import Dollar from '@/capture/dollar'
import type { Spread } from '@/capture/spread'
import AssertType from '@/test-utils/assert-type'

import type { DollarObjectSpread } from './dollar-object-spread'

describe('dollar-object-spread', () => {
  it('typeof $ carries the DollarObjectSpread brand (type-level)', () => {
    type HasBrand = typeof Dollar.$ extends DollarObjectSpread ? true : false
    AssertType.assertType<HasBrand, true>(0)
  })

  it('typeof $ is iterable over anonymous Spread tokens (type-level)', () => {
    type IterOK =
      typeof Dollar.$ extends Iterable<Spread<'', unknown>> ? true : false
    AssertType.assertType<IterOK, true>(0)
  })

  it('spread in object context produces only the REST_CAPTURE marker', () => {
    const spread = { ...Dollar.$ }
    expect(Object.keys(spread)).toEqual([])
    expect(Reflect.get(spread, Dollar.REST_CAPTURE)).toBe(true)
  })

  it('spreading $ in sequences yields a single item at runtime', () => {
    const seq = [...Dollar.$]
    expect(Array.isArray(seq)).toBe(true)
    expect(seq.length).toBe(1)
  })
})
