import CreateStore from '@/atom/create-store'
import Fixtures from '@/atom/fixtures'

import { Store } from './store'

describe('store', () => {
  it('narrows the binding after each add', () => {
    const store: Store = new Store()
    store.add(Fixtures.clock)
    store.add(Fixtures.settings)
    store.add(Fixtures.stamp)

    expect(store.get(Fixtures.Stamp).text).toBe('atom@1')
    expect(store.get(Fixtures.Stamp).clock).toBe(store.get(Fixtures.Clock))
  })

  it('keeps a conditionally added slot out of what get takes', () => {
    const store: Store = new Store()
    const sometimes = Math.random() < 1
    store.add(Fixtures.clock)
    if (sometimes) store.add(Fixtures.twice)

    expect(store.get(Fixtures.Clock).now).toBe(1)
    // @ts-expect-error Twice is filled on one branch only
    expect(store.get(Fixtures.Twice).at).toBe(2)
  })

  it('names the slots still missing when get comes too early', () => {
    const store: Store = new Store()
    store.add(Fixtures.stamp)

    // @ts-expect-error Clock and Settings are filled by nothing yet
    expect(() => store.get(Fixtures.Stamp)).toThrow(
      'Clock is not filled (read by Stamp)',
    )
    store.add(Fixtures.clock)
    store.add(Fixtures.settings)
    expect(store.get(Fixtures.Stamp).text).toBe('atom@1')
  })

  it('refuses get for a slot nothing added fills', () => {
    const store: Store = new Store()
    store.add(Fixtures.clock)

    // @ts-expect-error Twice was never added
    expect(() => store.get(Fixtures.Twice)).toThrow(
      'Twice is not filled (read by get)',
    )
  })

  it('builds a per-request value in a scope over the parent memo', () => {
    const parent = CreateStore.createStore(Fixtures.clock, Fixtures.settings)
    const first = parent.scope(Fixtures.request, Fixtures.handler)
    const second = parent.scope(Fixtures.request, Fixtures.handler)

    expect(first.get(Fixtures.Request)).not.toBe(second.get(Fixtures.Request))
    expect(first.get(Fixtures.Handler).request).toBe(
      first.get(Fixtures.Request),
    )
    expect(first.get(Fixtures.Handler).clock).toBe(parent.get(Fixtures.Clock))
    expect(second.get(Fixtures.Handler).clock).toBe(parent.get(Fixtures.Clock))
    // @ts-expect-error Request is filled in the scopes, not the parent
    expect(() => parent.get(Fixtures.Request)).toThrow(
      'Request is not filled (read by get)',
    )
  })

  it('refuses a scope filling a slot the parent fills', () => {
    const parent = CreateStore.createStore(Fixtures.clock)

    // @ts-expect-error Clock is filled by the parent already
    expect(() => parent.scope(Fixtures.clock)).toThrow(
      'Clock is filled above this scope already',
    )
  })
})
