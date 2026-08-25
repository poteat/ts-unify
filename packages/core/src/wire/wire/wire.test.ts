import AssertType from '@/test-utils/assert-type'
import Fixtures from '@/wire/fixtures'
import type { Missing } from '@/wire/missing'

import { wire } from './wire'

describe('wire', () => {
  it('builds each provider once and hands dependants the same instance', () => {
    const container = wire(Fixtures.clock, Fixtures.settings, Fixtures.stamp)
    const stamp = container.get(Fixtures.stamp)

    expect(stamp.text).toBe('wire@1')
    expect(container.get(Fixtures.stamp)).toBe(stamp)
    expect(stamp.clock).toBe(container.get(Fixtures.clock))
  })

  it('resolves the same graph with the providers reversed', () => {
    expect(
      wire(Fixtures.stamp, Fixtures.settings, Fixtures.clock).get(
        Fixtures.stamp,
      ).text,
    ).toBe('wire@1')
  })

  it('refuses a list missing a provider one of them declares', () => {
    AssertType.assertType<
      Missing<[typeof Fixtures.clock, typeof Fixtures.stamp]>,
      typeof Fixtures.settings
    >(0)

    // @ts-expect-error settings is declared by stamp and not in the list
    const incomplete = wire(Fixtures.clock, Fixtures.stamp)

    // @ts-expect-error settings is still missing
    expect(() => incomplete.get(Fixtures.stamp)).toThrow(
      'settings is not registered (asked for by stamp)',
    )
  })

  it('refuses get for a provider outside the list', () => {
    const container = wire(Fixtures.clock, Fixtures.settings)

    // @ts-expect-error twice is not in the list
    expect(() => container.get(Fixtures.twice)).toThrow(
      'twice is not registered (asked for by get)',
    )
  })

  it('throws naming both providers of a cycle', () => {
    const container = wire(Fixtures.ping, Fixtures.pong)

    expect(() => container.get(Fixtures.ping)).toThrow(
      'pong needs ping, which is still being built',
    )
  })

  it('keeps two alike providers apart at runtime, where Missing cannot', () => {
    const container = wire(Fixtures.one, Fixtures.two)

    expect(container.get(Fixtures.one).n).toBe(1)
    expect(container.get(Fixtures.two).n).toBe(2)
    AssertType.assertType<
      Missing<[typeof Fixtures.one, typeof Fixtures.needsTwo]>,
      never
    >(0)
    expect(() =>
      wire(Fixtures.one, Fixtures.needsTwo).get(Fixtures.needsTwo),
    ).toThrow('two is not registered (asked for by needsTwo)')
  })
})
