// eslint-disable-next-line @typescript-eslint/no-var-requires
const { RuleTester } = require("@typescript-eslint/rule-tester");
import { createRule } from "@ts-unify/eslint/internal";
import { functionDeclReturnToArrow } from "@ts-unify/rules";

const tester = new RuleTester({
  languageOptions: {
    parser: require("@typescript-eslint/parser"),
  },
});

tester.run(
  "singular-function-to-arrow",
  createRule(functionDeclReturnToArrow, {
    message: "Convert single-statement function to arrow function",
  }),
  {
    valid: [
      "const f = (x) => x + 1;",
      "function foo(x) { const y = x + 1; return y; }",
      "function* gen() { return 1; }",
      // Uses `this` — unsafe to convert to arrow.
      "function foo() { return this.x; }",
      // Uses `arguments` — unsafe to convert to arrow.
      "function foo() { return arguments[0]; }",
      // `this` in a default param value.
      "function foo(x = this.y) { return x; }",
    ],
    invalid: [
      {
        code: "function foo(x) { return x + 1; }",
        errors: [{ messageId: "match" }],
        output: "const foo = x => x + 1;",
      },
      {
        code: "const f = function(x) { return x * 2; };",
        errors: [{ messageId: "match" }],
        output: "const f = x => x * 2;",
      },
    ],
  }
);
