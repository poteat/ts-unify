import CreateStore from '@/atom/create-store'
import Fixtures from '@/atom/fixtures'
import type { Of } from '@/atom/of'
import Slot from '@/atom/slot'
import type { ValueOf } from '@/atom/value-of'
import AssertType from '@/test-utils/assert-type'

import { atom } from './atom'

describe('atom', () => {
  type N = Slot.Atom<number>

  it('declares a slot with the label as its key description', () => {
    const slot = atom<N>('n')

    expect(slot.key.description).toBe('n')
    expect(atom<N>('n').key).not.toBe(slot.key)
    expect(atom<N>().key.description).toBeUndefined()
    AssertType.assertType<typeof slot, N>(0)
  })

  it('declares an unnamed slot over a value type', () => {
    const slot = atom<number>('n')

    expect(slot.key.description).toBe('n')
    AssertType.assertType<typeof slot, Slot.Atom<number>>(0)
    AssertType.assertType<typeof slot, N>(0)
  })

  it('declares one slot over a union value type', () => {
    const slot = atom<string | undefined>('maybe')

    expect(
      CreateStore.createStore(atom(slot, () => undefined)).get(slot),
    ).toBeUndefined()
    AssertType.assertType<typeof slot, Slot.Atom<string | undefined>>(0)
    AssertType.assertType<ValueOf<typeof slot>, string | undefined>(0)
  })

  it('defines a slot with no deps from two arguments', () => {
    expect(Fixtures.clock.slot).toBe(Fixtures.Clock)
    expect(Fixtures.clock.deps).toEqual({})
    expect(Fixtures.clock.read({})).toEqual({ now: 1 })
    AssertType.assertType<typeof Fixtures.clock.slot, Fixtures.Clock>(0)
  })

  it('defines a slot over its deps from three arguments', () => {
    expect(Fixtures.stamp.slot).toBe(Fixtures.Stamp)
    expect(Fixtures.stamp.deps).toEqual({
      clock: Fixtures.Clock,
      settings: Fixtures.Settings,
    })
    AssertType.assertType<
      Of<typeof Fixtures.stamp.deps>,
      {
        readonly clock: ValueOf<Fixtures.Clock>
        readonly settings: ValueOf<Fixtures.Settings>
      }
    >(0)
    AssertType.assertType<typeof Fixtures.stamp.slot, Fixtures.Stamp>(0)
  })

  it('holds a read to the value type of its slot', () => {
    // @ts-expect-error a number is no string
    const wrong = atom(Fixtures.RepoRoot, () => 1)
    const plain = atom(Fixtures.CacheDir, { r: Fixtures.RepoRoot }, d => d.r)

    expect(wrong.slot).toBe(Fixtures.RepoRoot)
    expect(plain.read({ r: 'r' })).toBe('r')
    AssertType.assertType<ReturnType<typeof plain.read>, string>(0)
  })

  it('refuses a slot alone', () => {
    // @ts-expect-error a slot alone is no form of atom
    expect(() => atom(Fixtures.Clock)).toThrow(
      'atom takes a label, or a slot, its deps and a read',
    )
  })
})
