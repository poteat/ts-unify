import Fixtures from '@/atom/fixtures'
import type { Of } from '@/atom/of'
import AssertType from '@/test-utils/assert-type'

import { atom } from './atom'

describe('atom', () => {
  it('declares a slot with the label as its key description', () => {
    const slot = atom<number>('n')

    expect(slot.key.description).toBe('n')
    expect(atom<number>('n').key).not.toBe(slot.key)
    expect(atom<number>().key.description).toBeUndefined()
  })

  it('defines a slot with no deps from two arguments', () => {
    expect(Fixtures.clock.slot).toBe(Fixtures.Clock)
    expect(Fixtures.clock.deps).toEqual({})
    expect(Fixtures.clock.read({})).toEqual({ now: 1 })
  })

  it('defines a slot over its deps from three arguments', () => {
    expect(Fixtures.stamp.slot).toBe(Fixtures.Stamp)
    expect(Fixtures.stamp.deps).toEqual({
      clock: Fixtures.Clock,
      settings: Fixtures.Settings,
    })
    AssertType.assertType<
      Of<typeof Fixtures.stamp.deps>,
      { readonly clock: Fixtures.Clock; readonly settings: Fixtures.Settings }
    >(0)
  })

  it('refuses a slot alone', () => {
    // @ts-expect-error a slot alone is no form of atom
    expect(() => atom(Fixtures.Clock)).toThrow(
      'atom takes a label, or a slot, its deps and a read',
    )
  })
})
