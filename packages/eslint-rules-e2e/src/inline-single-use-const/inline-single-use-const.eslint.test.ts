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
    ],
  }
);
