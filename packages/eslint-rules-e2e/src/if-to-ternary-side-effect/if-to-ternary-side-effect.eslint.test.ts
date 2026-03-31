// eslint-disable-next-line @typescript-eslint/no-var-requires
const { RuleTester } = require("@typescript-eslint/rule-tester");
import { createRule } from "@ts-unify/eslint";
import { ifToTernarySideEffect } from "@ts-unify/rules";

const tester = new RuleTester({
  languageOptions: {
    parser: require("@typescript-eslint/parser"),
  },
});

tester.run(
  "if-to-ternary-side-effect",
  createRule(ifToTernarySideEffect, {
    message: "Use ternary expression instead of if/else side effects",
  }),
  {
    valid: [
      "cond ? doA() : doB();",
      "if (cond) { doA(); } else { return b; }",
      "if (cond) { doA(); }",
    ],
    invalid: [
      {
        code: "if (cond) { doA(); } else { doB(); }",
        errors: [{ messageId: "match" }],
        output: "cond ? doA() : doB();",
      },
      {
        code: "if (cond) doA(); else doB();",
        errors: [{ messageId: "match" }],
        output: "cond ? doA() : doB();",
      },
    ],
  }
);
