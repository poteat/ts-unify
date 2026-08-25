import Fixtures from '@/wire/fixtures'
import Wire from '@/wire/wire'

import { Container } from './container'

describe('container', () => {
  it('narrows the binding after each register', () => {
    const container: Container = new Container()
    container.register(Fixtures.clock)
    container.register(Fixtures.settings)
    container.register(Fixtures.stamp)

    expect(container.get(Fixtures.stamp).text).toBe('wire@1')
    expect(container.get(Fixtures.stamp).clock).toBe(
      container.get(Fixtures.clock),
    )
  })

  it('keeps a conditionally registered provider out of what get takes', () => {
    const container: Container = new Container()
    const sometimes = Math.random() < 1
    container.register(Fixtures.clock)
    if (sometimes) container.register(Fixtures.twice)

    expect(container.get(Fixtures.clock).now).toBe(1)
    // @ts-expect-error twice is registered on one branch only
    expect(container.get(Fixtures.twice).at).toBe(2)
  })

  it('names the dependencies still missing when get comes too early', () => {
    const container: Container = new Container()
    container.register(Fixtures.stamp)

    // @ts-expect-error clock and settings are not registered yet
    expect(() => container.get(Fixtures.stamp)).toThrow(
      'clock is not registered (asked for by stamp)',
    )
    container.register(Fixtures.clock)
    container.register(Fixtures.settings)
    expect(container.get(Fixtures.stamp).text).toBe('wire@1')
  })

  it('refuses get for an unregistered provider', () => {
    const container: Container = new Container()
    container.register(Fixtures.clock)

    // @ts-expect-error twice was never registered
    expect(() => container.get(Fixtures.twice)).toThrow(
      'twice is not registered (asked for by get)',
    )
  })

  it('resolves a per-request value in a scope over the parent memo', () => {
    const parent = Wire.wire(Fixtures.clock, Fixtures.settings)
    const first = parent.scope(Fixtures.request, Fixtures.handler)
    const second = parent.scope(Fixtures.request, Fixtures.handler)

    expect(first.get(Fixtures.request)).not.toBe(second.get(Fixtures.request))
    expect(first.get(Fixtures.handler).request).toBe(
      first.get(Fixtures.request),
    )
    expect(first.get(Fixtures.handler).clock).toBe(parent.get(Fixtures.clock))
    expect(second.get(Fixtures.handler).clock).toBe(parent.get(Fixtures.clock))
    // @ts-expect-error request lives in the scopes, not the parent
    expect(() => parent.get(Fixtures.request)).toThrow(
      'request is not registered (asked for by get)',
    )
  })
})
