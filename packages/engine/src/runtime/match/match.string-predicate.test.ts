import { U, $ } from '@ts-unify/core'

import { match } from './match'

const id = (name: string) => ({ type: 'Identifier', name })

const quoted = (value: string) => ({
  type: 'Property',
  key: { type: 'Literal', value },
  value: id('v'),
})

const prop = (k: unknown) => ({ type: 'Property', key: k, value: id('v') })

describe('match - string predicates', () => {
  it('tests a string position against a RegExp', () => {
    expect(match(id('fooBar'), U.Identifier({ name: /^foo/ }))).toEqual({})
    expect(match(id('bar'), U.Identifier({ name: /^foo/ }))).toBeNull()
    expect(
      match(id('bar'), U.Identifier({ name: U.string.regex(/^b/) })),
    ).toEqual({})
  })

  it('never matches a non-string', () => {
    expect(
      match({ type: 'Literal', value: 42 }, U.Literal({ value: /4/ })),
    ).toBeNull()
    expect(
      match(
        { type: 'Literal', value: 42 },
        U.Literal({ value: U.string.identifierName() }),
      ),
    ).toBeNull()
  })

  it('matches a reserved word with U.string.reserved and not a near miss', () => {
    const p = U.Identifier({ name: U.string.reserved() })
    expect(match(id('class'), p)).toEqual({})
    expect(match(id('let'), p)).toEqual({})
    expect(match(id('klass'), p)).toBeNull()
    expect(
      match(
        id('let'),
        U.Identifier({ name: U.string.reserved({ strict: false }) }),
      ),
    ).toBeNull()
    expect(
      match(
        id('type'),
        U.Identifier({ name: U.string.reserved({ typescript: true }) }),
      ),
    ).toEqual({})
  })

  it('matches an IdentifierName key and negates with U.string.not', () => {
    const needless = U.Property({
      key: U.Literal({ value: U.string.identifierName() }),
    })
    expect(match(quoted('name'), needless)).toEqual({})
    expect(match(quoted('data-id'), needless)).toBeNull()
    const bindable = U.Identifier({ name: U.string.not(U.string.reserved()) })
    expect(match(id('klass'), bindable)).toEqual({})
    expect(match(id('class'), bindable)).toBeNull()
  })

  it('works in sequence positions and beside captures', () => {
    expect(
      match(
        {
          type: 'CallExpression',
          callee: id('log'),

          arguments: [
            {
              type: 'Literal',
              value: 'hello',
            },
          ],
        },
        U.CallExpression({
          callee: U.Identifier({
            name: /^(log|warn)$/,
          }),

          arguments: [
            U.Literal({
              value: $('v'),
            }),
          ],
        }),
      ),
    ).toEqual({
      v: 'hello',
    })
  })

  it('applies a .when over a U.or capture once, whichever branch bound it', () => {
    const key = U.or(
      U.Identifier({ name: $('key') }),
      U.Literal({ value: $('key') }),
    ).when(
      (bag: { key: unknown }): bag is { key: string } =>
        U.string.identifierName()(bag.key) && !U.string.reserved()(bag.key),
    )
    const p = U.Property({ key, value: U.Identifier({ name: 'v' }) })
    expect(match(prop(id('name')), p)).toEqual({ key: 'name' })
    expect(match(prop({ type: 'Literal', value: 'name' }), p)).toEqual({
      key: 'name',
    })
    expect(match(prop(id('class')), p)).toBeNull()
    expect(match(prop({ type: 'Literal', value: 'data-id' }), p)).toBeNull()
    expect(match(prop({ type: 'Literal', value: 1 }), p)).toBeNull()
  })

  it('resets a global RegExp between tests', () => {
    const p = U.Identifier({
      name: /a/g,
    })

    expect(match(id('a'), p)).toEqual({})
    expect(match(id('a'), p)).toEqual({})
  })
})
