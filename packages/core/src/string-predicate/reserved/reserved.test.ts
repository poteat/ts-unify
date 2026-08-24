import ts from 'typescript'

import { reserved } from './reserved'
import {
  CONTEXTUAL_KEYWORDS,
  RESERVED_WORDS,
  STRICT_MODE_RESERVED_WORDS,
} from './reserved-words'

function between(first: string, last: string): string[] {
  const kinds = ts.SyntaxKind as unknown as Record<string, number>

  return [
    ...Object.entries(
      (ts as unknown as { textToKeywordObj: Record<string, number> })
        .textToKeywordObj,
    )
      .filter(([, kind]) => kind >= kinds[first] && kind <= kinds[last])
      .map(([text]) => text),
  ].sort()
}

describe('reserved', () => {
  it("matches the installed TypeScript's keyword table", () => {
    expect(RESERVED_WORDS).toEqual(
      between('FirstReservedWord', 'LastReservedWord'),
    )
    expect(STRICT_MODE_RESERVED_WORDS).toEqual(
      between('FirstFutureReservedWord', 'LastFutureReservedWord'),
    )
    expect(CONTEXTUAL_KEYWORDS).toEqual(
      between('FirstContextualKeyword', 'LastContextualKeyword'),
    )
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
      expect(reserved({ strict: false })(word)).toBe(true)
    }

    expect(reserved()('klass')).toBe(false)
    expect(reserved()('')).toBe(false)
    expect(reserved()('Class')).toBe(false)
  })

  it('counts the strict-mode words and await unless strict is false', () => {
    for (const word of [
      'let',
      'yield',
      'static',
      'implements',
      'interface',
      'await',
    ]) {
      expect(reserved()(word)).toBe(true)
      expect(reserved({ strict: true })(word)).toBe(true)
      expect(reserved({ strict: false })(word)).toBe(false)
    }
  })

  it("counts TypeScript's contextual keywords only when asked", () => {
    for (const word of ['type', 'of', 'as', 'async', 'declare', 'namespace']) {
      expect(reserved()(word)).toBe(false)
      expect(reserved({ typescript: true })(word)).toBe(true)
    }

    expect(reserved({ strict: false, typescript: true })('await')).toBe(true)
  })

  it('is false for a non-string', () => {
    expect(reserved()(1)).toBe(false)
    expect(reserved()(null)).toBe(false)
  })
})
