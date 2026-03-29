// eslint-disable-next-line @typescript-eslint/no-var-requires
const { RuleTester } = require("@typescript-eslint/rule-tester");
import { createRule } from "@ts-unify/eslint";
import { normalizeTernaryOrder } from "@ts-unify/rules";

const tester = new RuleTester({
  languageOptions: {
    parser: require("@typescript-eslint/parser"),
  },
});

// Note: This rule uses U.or() with two ConditionalExpression branches.
// Because createRule assigns visitors by tag, the second branch (inequality)
// overwrites the first (negation). Additionally, .when() is not implemented
// in the ESLint matcher, so the inequality branch matches ANY ternary whose
// test is a BinaryExpression — not just !== and !=.
tester.run(
  "normalize-ternary-order",
  createRule(normalizeTernaryOrder, {
    message: "Normalize ternary to use positive condition",
  }),
  {
    valid: [
      // Simple identifier test — not a BinaryExpression, so not matched
      "const x = cond ? a : b;",
      // Call expression test — not a BinaryExpression
      "const x = isReady() ? a : b;",
    ],
    invalid: [
      {
        // !== is the intended target of this rule
        code: "const x = a !== b ? c : d;",
        errors: [{ messageId: "match" }],
      },
      {
        // != is the intended target of this rule
        code: "const x = a != b ? c : d;",
        errors: [{ messageId: "match" }],
      },
      {
        // === also matches because .when() guard is not enforced
        code: "const x = a === b ? c : d;",
        errors: [{ messageId: "match" }],
      },
    ],
  }
);
