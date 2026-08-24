import { symGet } from './sym-get'

describe('sym-get', () => {
  it('retrieves a symbol-keyed property', () => {
    const sym = Symbol('test')

    expect(
      symGet(
        {
          [sym]: 42,
        },
        sym,
      ),
    ).toBe(42)
  })

  it('returns undefined when the symbol key is absent', () => {
    expect(
      symGet(
        {
          other: 1,
        },
        Symbol('missing'),
      ),
    ).toBeUndefined()
  })

  it('works with Symbol.for keys', () => {
    const sym = Symbol.for('shared')

    expect(
      symGet(
        {
          [sym]: 'hello',
        },
        sym,
      ),
    ).toBe('hello')
  })

  it('returns undefined for an empty object', () => {
    expect(symGet({}, Symbol('any'))).toBeUndefined()
  })
})
