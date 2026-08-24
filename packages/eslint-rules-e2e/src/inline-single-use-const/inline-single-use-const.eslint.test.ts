/**
 * inlineSingleUseConst compiled by createRule and driven through ESLint's
 * RuleTester over the cases below.
 *
 * @scenario
 */
import { createRule } from '@ts-unify/eslint/internal'
import { inlineSingleUseConst } from '@ts-unify/rules'

import Tester from '../tester'

describe('inline-single-use-const.eslint', () => {
  Tester.run(
    'inline-single-use-const',
    createRule(inlineSingleUseConst, {
      message: 'Inline single-use const',
    }),
    {
      valid: [
        {
          name: 'a const read twice',
          code: 'function f() { const x = 1; console.log(x); return x; }',
        },
        {
          name: 'a let',
          code: 'function f() { let x = 1; x++; }',
        },
        {
          name: 'a const with no statement after it',
          code: 'function f() { const x = 1; }',
        },
        {
          name: 'reads inside closures',
          code:
            'function f() { const runs: number[] = []; return { keep: ' +
            '(n: number) => runs.push(n), count: () => runs.length }; }',
        },
        {
          name: "a read in a loop's test",
          code:
            'function f(ms: number) { const deadline = Date.now() + ms; ' +
            'while (Date.now() < deadline) {} }',
        },
        {
          name: "a read in a loop's body",
          code:
            'function f(xs: number[], abort: (e: Error) => void) { const ' +
            "reason = new Error('x'); for (const x of xs) abort(reason); }",
        },
        {
          name: 'a read inside a callback',
          code:
            'function f(make: () => Promise<number>, later: (cb: () => ' +
            'Promise<number>) => void) { const held = make(); ' +
            'later(async () => await held); }',
        },
        {
          name: 'a typeof of the name',
          code:
            'function f(make: () => { a: number }) { const first = make(); ' +
            'const second: typeof first = { a: first.a + 1 }; ' +
            'return [second]; }',
        },
        {
          name: 'a same-named parameter after the declaration',
          code:
            'function f(seed: () => number, xs: number[]) { const x = ' +
            'seed(); return xs.map(x => x + 1); }',
        },
        {
          name: 'an annotated const keeps its check',
          code:
            'function f(value: unknown, keep: (n: number) => void) { const ' +
            'checked: number = value as number; keep(checked); }',
        },
        {
          name: 'a template fragment keeps its name',
          code:
            'function f(name: string) { const head = `export function ' +
            '${name}`; return `${head}(): void`; }',
        },
        {
          name: 'a shorthand property',
          code:
            'function f(make: () => number) { const n = make(); ' +
            'return { n }; }',
        },
        {
          name: 'an effectful initializer after another effect',
          code:
            'function f(a: () => number, b: () => number, use: (x: number, ' +
            'y: number) => void) { const x = a(); use(b(), x); }',
        },
      ],
      invalid: [
        {
          name: 'a member read into a const and called once',
          code:
            'function f() {\n  const handler = config.onError;\n  ' +
            'handler(err);\n}',
          errors: [{ messageId: 'match' }],
          output: 'function f() {\n    config.onError(err);\n}',
        },
        {
          name: 'a sum returned through a const',
          code: 'function f() {\n  const x = a + b;\n  return x;\n}',
          errors: [{ messageId: 'match' }],
          output: 'function f() {\n    return a + b;\n}',
        },
        {
          name: 'a key named like the const is no read',
          code:
            'function f(read: () => string, other: number) {\n  const path ' +
            '= read();\n  return { path: other, n: path.length };\n}',
          errors: [{ messageId: 'match' }],
          output:
            'function f(read: () => string, other: number) {\n    return ' +
            '{\n        path: other,\n        n: read().length\n    };\n}',
        },
        {
          name: 'a later const is examined when the first is not inlinable',
          code:
            'function f(use: (n: number) => void, g: () => number) {\n  ' +
            'const a = g();\n  use(a);\n  use(a);\n  const b = g();\n  ' +
            'use(b);\n}',
          errors: [{ messageId: 'match' }],
          output:
            'function f(use: (n: number) => void, g: () => number) {\n    ' +
            'const a = g();\n    use(a);\n    use(a);\n    use(g());\n}',
        },
      ],
    },
  )
})
