import { createRule } from '@ts-unify/eslint/internal'
import { singularFunctionToArrow } from '@ts-unify/rules'
import { parse } from '@typescript-eslint/typescript-estree'

/**
 * Run a rule over parsed source and return each report's fix text, whitespace
 * collapsed.
 */
function fixes(src: string): string[] {
  const ast = parse(src, { range: true, loc: true })
  const rule = createRule(singularFunctionToArrow as any)
  const out: string[] = []
  const fixer = {
    replaceText: (_n: unknown, text: string) => text,
    insertTextBeforeRange: () => '',
  }
  const sourceCode = {
    ast,
    text: src,
    getText: (n?: { range: [number, number] }) =>
      n ? src.slice(n.range[0], n.range[1]) : src,
  }
  const visitors = rule.create({
    sourceCode,
    report: (d: any) => out.push(d.fix(fixer).replace(/\s+/g, ' ')),
  } as any)

  function walk(n: any, parent: any) {
    n.parent = parent
    visitors[n.type]?.(n)

    for (const [k, v] of Object.entries(n)) {
      if (k === 'parent') continue

      for (const c of Array.isArray(v) ? v : [v]) {
        if (c && typeof (c as any).type === 'string') walk(c, n)
      }
    }
  }

  walk(ast, null)

  return out
}

describe('createRule fixes on TypeScript nodes', () => {
  it('reprints a function type in the return annotation', () => {
    expect(
      fixes('function f(): { a?: (x: string) => string } { return {} }'),
    ).toEqual(['const f = (): { a?: (x: string) => string; } => ({});'])
  })

  it('keeps type arguments on a type reference', () => {
    expect(
      fixes(
        'function f() { return globalThis as unknown as ReturnType<typeof f> }',
      ),
    ).toEqual([
      'const f = () => globalThis as unknown as ReturnType<typeof f>;',
    ])
  })
})
