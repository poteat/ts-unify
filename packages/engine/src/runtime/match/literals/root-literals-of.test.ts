import { $, U } from '@ts-unify/core/internal'

import Fixtures from './fixtures'
import { rootLiteralsOf } from './root-literals-of'

describe('root-literals-of', () => {
  it('reads a literal, a nested proxy type and its fields', () => {
    expect(
      Fixtures.keyedValues({
        operator: '&&',
        right: U.MemberExpression({ computed: false, object: $('o') }),
      }),
    ).toEqual([
      ['operator', ['&&']],
      ['right.type', ['MemberExpression']],
      ['right.computed', [false]],
    ])
  })

  it('reads a U.or of literals as the values it allows', () => {
    expect(Fixtures.keyedValues({ operator: U.or('===', '==') })).toEqual([
      ['operator', ['===', '==']],
    ])
  })

  it('reads a U.or of node proxies as the types it allows', () => {
    expect(
      Fixtures.keyedValues({
        parent: U.or(U.FunctionDeclaration(), U.ArrowFunctionExpression()),
      }),
    ).toEqual([
      ['parent.type', ['FunctionDeclaration', 'ArrowFunctionExpression']],
    ])
  })

  it('reads nothing from a capture, a Comment, a maybeBlock or a mix', () => {
    expect(Fixtures.keyedValues({ test: $('t'), alternate: $ })).toEqual([])
    expect(
      Fixtures.keyedValues({ comments: [U.Comment({ kind: 'line' })] }),
    ).toEqual([])
    expect(
      Fixtures.keyedValues({ consequent: U.maybeBlock(U.ReturnStatement()) }),
    ).toEqual([])
    expect(Fixtures.keyedValues({ left: U.or('a', U.Identifier()) })).toEqual(
      [],
    )
    expect(Fixtures.keyedValues($)).toEqual([])
  })

  it('reads the elements before the first spread of an array', () => {
    expect(
      Fixtures.keyedValues({
        body: [U.ReturnStatement({ argument: null }), ...$('rest')],
      }),
    ).toEqual([
      ['body.0.type', ['ReturnStatement']],
      ['body.0.argument', [null]],
    ])
  })

  it('keeps the literals by the pattern object', () => {
    expect(rootLiteralsOf(Fixtures.TYPEOF_BINARY)).toBe(
      rootLiteralsOf(Fixtures.TYPEOF_BINARY),
    )
  })
})
