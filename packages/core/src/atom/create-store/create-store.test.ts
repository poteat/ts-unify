import Fixtures from '@/atom/fixtures'
import type { Missing } from '@/atom/missing'
import AssertType from '@/test-utils/assert-type'

import { createStore } from './create-store'

describe('create-store', () => {
  it('builds each slot once and hands readers the same value', () => {
    const store = createStore(Fixtures.clock, Fixtures.settings, Fixtures.stamp)
    const stamp = store.get(Fixtures.Stamp)

    expect(stamp.text).toBe('atom@1')
    expect(store.get(Fixtures.Stamp)).toBe(stamp)
    expect(stamp.clock).toBe(store.get(Fixtures.Clock))
  })

  it('resolves the same graph with the definitions reversed', () => {
    expect(
      createStore(Fixtures.stamp, Fixtures.settings, Fixtures.clock).get(
        Fixtures.Stamp,
      ).text,
    ).toBe('atom@1')
  })

  it('refuses a list with a slot read and filled by nothing', () => {
    AssertType.assertType<
      Missing<[typeof Fixtures.clock, typeof Fixtures.stamp]>,
      Fixtures.Settings
    >(0)

    // @ts-expect-error Settings is read by stamp and filled by nothing
    const incomplete = createStore(Fixtures.clock, Fixtures.stamp)

    // @ts-expect-error Settings is still missing under Stamp
    expect(() => incomplete.get(Fixtures.Stamp)).toThrow(
      'Settings is not filled (read by Stamp)',
    )
  })

  it('refuses get for a slot outside the list', () => {
    const store = createStore(Fixtures.clock, Fixtures.settings)

    // @ts-expect-error Twice is filled by nothing in the list
    expect(() => store.get(Fixtures.Twice)).toThrow(
      'Twice is not filled (read by get)',
    )
  })

  it('throws naming both slots of a cycle', () => {
    const store = createStore(Fixtures.ping, Fixtures.pong)

    expect(() => store.get(Fixtures.Ping)).toThrow(
      'Pong reads Ping, which is still being built',
    )
  })

  it('keeps two alike slots apart by their names', () => {
    const store = createStore(Fixtures.one, Fixtures.two, Fixtures.needsTwo)
    const oneAlone = createStore(Fixtures.one)

    expect(store.get(Fixtures.One).n).toBe(1)
    expect(store.get(Fixtures.Two).n).toBe(2)
    expect(store.get(Fixtures.NeedsTwo).doubled).toBe(4)
    // @ts-expect-error One and Two are two types, alike in value
    AssertType.assertType<Fixtures.One, Fixtures.Two>(0)
    AssertType.assertType<
      Missing<[typeof Fixtures.one, typeof Fixtures.needsTwo]>,
      Fixtures.Two
    >(0)
    // @ts-expect-error Two is read by needsTwo and filled by nothing
    const incomplete = createStore(Fixtures.one, Fixtures.needsTwo)

    // @ts-expect-error Two is still missing under NeedsTwo
    expect(() => incomplete.get(Fixtures.NeedsTwo)).toThrow(
      'Two is not filled (read by NeedsTwo)',
    )
    // @ts-expect-error Two is filled by nothing in the list
    expect(() => oneAlone.get(Fixtures.Two)).toThrow(
      'Two is not filled (read by get)',
    )
  })

  it('refuses a list leaving one of two string slots unfilled', () => {
    // @ts-expect-error CacheDir is read by cache and filled by nothing
    const incomplete = createStore(Fixtures.repoRoot, Fixtures.cache)

    // @ts-expect-error CacheDir is still missing under Cache
    expect(() => incomplete.get(Fixtures.Cache)).toThrow(
      'CacheDir is not filled (read by Cache)',
    )
    expect(
      createStore(Fixtures.repoRoot, Fixtures.cacheDir, Fixtures.cache).get(
        Fixtures.Cache,
      ).dir,
    ).toBe('r/c')
  })

  it('refuses get of one string slot on a store filling the other', () => {
    const store = createStore(Fixtures.repoRoot)

    expect(store.get(Fixtures.RepoRoot)).toBe('r')
    AssertType.assertType<
      ReturnType<typeof store.get<Fixtures.RepoRoot>>,
      string
    >(0)
    // @ts-expect-error CacheDir is filled by nothing in the list
    expect(() => store.get(Fixtures.CacheDir)).toThrow(
      'CacheDir is not filled (read by get)',
    )
  })

  it('names a slot by its label, or as unlabelled', () => {
    const store = createStore(Fixtures.clock)

    // @ts-expect-error Nameless is filled by nothing
    expect(() => store.get(Fixtures.Nameless)).toThrow(
      'an unlabelled atom is not filled (read by get)',
    )
  })
})
