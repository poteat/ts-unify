// eslint-disable-next-line @typescript-eslint/no-var-requires
const { RuleTester } = require("@typescript-eslint/rule-tester");
import { createRule } from "@ts-unify/eslint/internal";
import { inlineSingleUseConst } from "@ts-unify/rules";

const tester = new RuleTester({
  languageOptions: {
    parser: require("@typescript-eslint/parser"),
  },
});

tester.run(
  "inline-single-use-const",
  createRule(inlineSingleUseConst, {
    message: "Inline single-use const",
  }),
  {
    valid: [
      // Multiple statements — not a single-use pattern
      "function f() { const x = 1; console.log(x); return x; }",
      // let, not const
      "function f() { let x = 1; x++; }",
      // No following statement
      "function f() { const x = 1; }",
      // Reads inside closures
      "function f() { const runs: number[] = []; return { keep: (n: number) => runs.push(n), count: () => runs.length }; }",
      // A read in a loop's test
      "function f(ms: number) { const deadline = Date.now() + ms; while (Date.now() < deadline) {} }",
      // A read in a loop's body
      "function f(xs: number[], abort: (e: Error) => void) { const reason = new Error('x'); for (const x of xs) abort(reason); }",
      // A read inside a callback
      "function f(make: () => Promise<number>, later: (cb: () => Promise<number>) => void) { const held = make(); later(async () => await held); }",
      // A typeof of the name
      "function f(make: () => { a: number }) { const first = make(); const second: typeof first = { a: first.a + 1 }; return [second]; }",
      // A same-named parameter after the declaration
      "function f(seed: () => number, xs: number[]) { const x = seed(); return xs.map(x => x + 1); }",
      // An annotated const keeps its check
      "function f(value: unknown, keep: (n: number) => void) { const checked: number = value as number; keep(checked); }",
      // A shorthand property
      "function f(make: () => number) { const n = make(); return { n }; }",
      // An effectful initializer after another effect
      "function f(a: () => number, b: () => number, use: (x: number, y: number) => void) { const x = a(); use(b(), x); }",
    ],
    invalid: [
      {
        code: "function f() {\n  const handler = config.onError;\n  handler(err);\n}",
        errors: [{ messageId: "match" }],
        output: "function f() {\n    config.onError(err);\n}",
      },
      {
        code: "function f() {\n  const x = a + b;\n  return x;\n}",
        errors: [{ messageId: "match" }],
        output: "function f() {\n    return a + b;\n}",
      },
      // A key named like the const is no read; the one read is inlined
      {
        code: "function f(read: () => string, other: number) {\n  const path = read();\n  return { path: other, n: path.length };\n}",
        errors: [{ messageId: "match" }],
        output: "function f(read: () => string, other: number) {\n    return {\n        path: other,\n        n: read().length\n    };\n}",
      },
      // A later const is examined when the first is not inlinable
      {
        code: "function f(use: (n: number) => void, g: () => number) {\n  const a = g();\n  use(a);\n  use(a);\n  const b = g();\n  use(b);\n}",
        errors: [{ messageId: "match" }],
        output: "function f(use: (n: number) => void, g: () => number) {\n    const a = g();\n    use(a);\n    use(a);\n    use(g());\n}",
      },
    ],
  }
);
