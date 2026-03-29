// eslint-disable-next-line @typescript-eslint/no-var-requires
const { RuleTester } = require("@typescript-eslint/rule-tester");
import { createRule } from "@ts-unify/eslint";
import { ifGuardedReturnToTernary } from "@ts-unify/rules";

const tester = new RuleTester({
  languageOptions: {
    parser: require("@typescript-eslint/parser"),
  },
});

tester.run(
  "if-guarded-return-to-ternary",
  createRule(ifGuardedReturnToTernary, {
    message: "Use ternary instead of if-guarded return",
  }),
  {
    valid: [
      "function f() { return cond ? a : b; }",
      "function f() { if (cond) { return a; } else { return b; } }",
      "function f() { if (cond) { doSomething(); } return b; }",
    ],
    invalid: [
      {
        code: "function f() { if (cond) { return a; } return b; }",
        errors: [{ messageId: "match" }],
      },
      {
        code: "function f() { if (cond) return a; return b; }",
        errors: [{ messageId: "match" }],
      },
      {
        code: "function f() { setup(); if (cond) { return a; } return b; }",
        errors: [{ messageId: "match" }],
      },
    ],
  }
);
