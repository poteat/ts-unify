import { identifierName } from './identifier-name'

const isIdentifierName = identifierName()

const v: unknown = 'name'

describe('identifierName', () => {
  it('accepts ASCII identifiers, $ and _', () => {
    for (const s of ['a', 'fooBar', '_', '$', '$el', '_x1', 'a1', 'x$y_z'])
      expect(isIdentifierName(s)).toBe(true)
  })

  it('accepts unicode ID_Start and ID_Continue', () => {
    for (const s of ['π', '变量', 'ñandú', 'á', 'x‌y', '℮'])
      expect(isIdentifierName(s)).toBe(true)
  })

  it('rejects a leading digit, punctuation, space, and the empty string', () => {
    for (const s of ['', '1a', 'foo-bar', 'a b', 'a.b', ' a', 'a\n', '́a'])
      expect(isIdentifierName(s)).toBe(false)
  })

  it('is not reserved-word-aware', () => {
    expect(isIdentifierName('class')).toBe(true)
    expect(isIdentifierName('await')).toBe(true)
  })

  it('narrows to string and refuses non-strings', () => {
    if (isIdentifierName(v)) expect(v.length).toBe(4)
    const key: string | number = Math.random() > 2 ? 1 : 'k'
    if (isIdentifierName(key)) expect(key.toUpperCase()).toBe('K')
    expect(isIdentifierName(42)).toBe(false)
    expect(isIdentifierName(null)).toBe(false)
  })
})
