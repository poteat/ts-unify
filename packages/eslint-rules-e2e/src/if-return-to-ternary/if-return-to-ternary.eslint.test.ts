// eslint-disable-next-line @typescript-eslint/no-var-requires
const { RuleTester } = require("@typescript-eslint/rule-tester");
import { createRule } from "@ts-unify/eslint/internal";
import { ifReturnToTernary } from "@ts-unify/rules";

const tester = new RuleTester({
  languageOptions: {
    parser: require("@typescript-eslint/parser"),
  },
});

tester.run(
  "if-return-to-ternary",
  createRule(ifReturnToTernary, {
    message: "Use ternary return instead of if/else return",
  }),
  {
    valid: [
      "return cond ? a : b;",
      "if (cond) { doSomething(); } else { return b; }",
      "if (cond) { return a; }",
    ],
    invalid: [
      {
        code: "function f() { if (cond) { return a; } else { return b; } }",
        errors: [{ messageId: "match" }],
        output: "function f() { return cond ? a : b; }",
      },
      {
        code: "function f() { if (cond) return a; else return b; }",
        errors: [{ messageId: "match" }],
        output: "function f() { return cond ? a : b; }",
      },
    ],
  }
);
