import ts from 'typescript'

import { CONTEXTUAL_KEYWORDS } from './contextual-keywords'
import { reserved } from './reserved'
import { RESERVED_WORDS } from './reserved-words'
import { STRICT_MODE_RESERVED_WORDS } from './strict-mode-reserved-words'

describe('reserved', () => {
  const kinds = ts.SyntaxKind as unknown as Record<string, number>
  const keywords = (
    ts as unknown as { textToKeywordObj: Record<string, number> }
  ).textToKeywordObj

  const range = (
    name: 'ReservedWord' | 'FutureReservedWord' | 'ContextualKeyword',
  ) =>
    [
      ...Object.entries(keywords)
        .filter(
          ([, kind]) =>
            kind >= kinds[`First${name}`] && kind <= kinds[`Last${name}`],
        )
        .map(([text]) => text),
    ].sort()

  it("matches the installed TypeScript's keyword table", () => {
    expect([...RESERVED_WORDS]).toEqual(range('ReservedWord'))
    expect([...STRICT_MODE_RESERVED_WORDS]).toEqual(range('FutureReservedWord'))
    expect([...CONTEXTUAL_KEYWORDS]).toEqual(range('ContextualKeyword'))
  })

  it('always counts the ECMAScript reserved words', () => {
    for (const word of [
      'break',
      'class',
      'this',
      'null',
      'true',
      'enum',
      'in',
    ]) {
      expect(reserved()(word)).toBe(true)
      expect(reserved({ isStrict: false })(word)).toBe(true)
    }

    expect(reserved()('klass')).toBe(false)
    expect(reserved()('')).toBe(false)
    expect(reserved()('Class')).toBe(false)
  })

  it('counts the strict-mode words and await unless isStrict is false', () => {
    for (const word of [
      'let',
      'yield',
      'static',
      'implements',
      'interface',
      'await',
    ]) {
      expect(reserved()(word)).toBe(true)
      expect(reserved({ isStrict: true })(word)).toBe(true)
      expect(reserved({ isStrict: false })(word)).toBe(false)
    }
  })

  it("counts TypeScript's contextual keywords only when asked", () => {
    for (const word of ['type', 'of', 'as', 'async', 'declare', 'namespace']) {
      expect(reserved()(word)).toBe(false)
      expect(reserved({ isTypeScript: true })(word)).toBe(true)
    }

    expect(reserved({ isStrict: false, isTypeScript: true })('await')).toBe(
      true,
    )
  })

  it('is false for a non-string', () => {
    expect(reserved()(1)).toBe(false)
    expect(reserved()(null)).toBe(false)
  })
})
