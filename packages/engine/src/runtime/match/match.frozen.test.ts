import { U, $ } from '@ts-unify/core'

import { match } from './match'

const id = (name: string) => ({ type: 'Identifier', name })

describe('match - frozen pattern', () => {
  it('matches a pattern frozen at module scope', () => {
    const NAMED = Object.freeze(U.Identifier({ name: $('n') }))
    expect(match(id('foo'), NAMED)).toEqual({ n: 'foo' })
    expect(match({ type: 'Literal', value: 1 }, NAMED)).toBeNull()
  })

  it('matches a frozen pattern narrowed after freezing', () => {
    const SHORT = Object.freeze(U.Identifier({ name: $('n') })).when(
      (it: { n: string }) => it.n.length < 4,
    )
    expect(match(id('foo'), SHORT)).toEqual({ n: 'foo' })
    expect(match(id('quux'), SHORT)).toBeNull()
  })

  it('matches a frozen pattern embedded in a larger one', () => {
    const RET = U.ReturnStatement({
      argument: Object.freeze(
        U.Identifier({
          name: $('n'),
        }),
      ),
    })

    expect(
      match(
        {
          type: 'ReturnStatement',
          argument: id('x'),
        },
        RET,
      ),
    ).toEqual({
      n: 'x',
    })
  })
})
