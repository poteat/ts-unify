// eslint-disable-next-line @typescript-eslint/no-var-requires
const { RuleTester } = require("@typescript-eslint/rule-tester");
import { createRule } from "@ts-unify/eslint";
import { elideBracesForReturn } from "@ts-unify/rules";

const tester = new RuleTester({
  languageOptions: {
    parser: require("@typescript-eslint/parser"),
  },
});

tester.run(
  "elide-braces-for-return",
  createRule(elideBracesForReturn, {
    message: "Elide braces for arrow function with single return",
  }),
  {
    valid: [
      "const f = (x) => x + 1;",
      "function foo() { return 1; }",
      "const f = () => { a(); b(); };",
      "const f = () => { const x = 1; return x; };",
    ],
    invalid: [
      {
        code: "const f = (x) => { return x + 1; };",
        errors: [{ messageId: "match" }],
      },
      {
        code: "const g = () => { return 42; };",
        errors: [{ messageId: "match" }],
      },
    ],
  }
);
