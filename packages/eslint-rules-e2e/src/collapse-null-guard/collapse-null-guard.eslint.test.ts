// eslint-disable-next-line @typescript-eslint/no-var-requires
const { RuleTester } = require("@typescript-eslint/rule-tester");
import { createRule } from "@ts-unify/eslint";
import { collapseNullGuard } from "@ts-unify/rules";

const tester = new RuleTester({
  languageOptions: {
    parser: require("@typescript-eslint/parser"),
  },
});

tester.run(
  "collapse-null-guard",
  createRule(collapseNullGuard, {
    message: "Use ?? instead of null guard with early return",
  }),
  {
    valid: [
      "function f(x) { return x ?? def; }",
      "function f(x) { if (x !== null) return def; return x; }",
      "function f(x) { if (x === undefined) return def; return x; }",
    ],
    invalid: [
      {
        code: "function f(x) { if (x === null) return def; return x; }",
        errors: [{ messageId: "match" }],
        output: "function f(x) {\n    return x ?? def;\n}",
      },
      {
        code: "function f(x) { if (x === null) { return def; } return x; }",
        errors: [{ messageId: "match" }],
        output: "function f(x) {\n    return x ?? def;\n}",
      },
      {
        code: "function f(x) { setup(); if (x === null) return def; return x; }",
        errors: [{ messageId: "match" }],
        output: "function f(x) {\n    setup();\n    return x ?? def;\n}",
      },
    ],
  }
);
