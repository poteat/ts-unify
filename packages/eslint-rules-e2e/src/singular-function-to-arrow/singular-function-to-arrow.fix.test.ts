/**
 * The fix text createRule produces for singularFunctionToArrow on
 * TypeScript nodes, read off a walk of the parsed source.
 *
 * @scenario
 */
import { createRule } from '@ts-unify/eslint/internal'
import { singularFunctionToArrow } from '@ts-unify/rules'
import type { TSESTree } from '@typescript-eslint/types'
import { parse } from '@typescript-eslint/typescript-estree'

import Nodes from '../nodes'

describe('singular-function-to-arrow.fix', () => {
  function fixes(src: string): string[] {
    const ast = parse(src, { range: true, loc: true })
    const rule = createRule(singularFunctionToArrow)
    const texts: string[] = []
    const fixer = {
      replaceText: (node: TSESTree.Node, text: string) => ({
        range: node.range,
        text,
      }),
      insertTextBeforeRange: (range: [number, number], text: string) => ({
        range,
        text,
      }),
    }
    const visitors = rule.create({
      sourceCode: {
        ast,
        text: src,
        getText: (n?: { range: [number, number] }) =>
          n ? src.slice(n.range[0], n.range[1]) : src,
      },
      report: d => {
        const fix = d.fix?.(fixer)

        if (fix && !Array.isArray(fix)) {
          texts.push(fix.text.replace(/\s+/g, ' '))
        }
      },
    })

    function walk(n: Nodes.Walked, parent: Nodes.Walked | null) {
      n.parent = parent
      if (n.type in visitors) visitors[n.type](n as TSESTree.Node)

      for (const [k, v] of Object.entries(n)) {
        if (k === 'parent') continue

        for (const c of Array.isArray(v) ? v : [v]) {
          if (Nodes.isNode(c)) walk(c, n)
        }
      }
    }

    walk(ast, null)

    return texts
  }

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
