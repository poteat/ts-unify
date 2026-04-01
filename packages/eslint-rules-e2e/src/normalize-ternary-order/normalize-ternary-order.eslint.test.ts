// eslint-disable-next-line @typescript-eslint/no-var-requires
const { RuleTester } = require("@typescript-eslint/rule-tester");
import { createRule } from "@ts-unify/eslint/internal";
import { normalizeTernaryOrder } from "@ts-unify/rules";

const tester = new RuleTester({
  languageOptions: {
    parser: require("@typescript-eslint/parser"),
  },
});

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
      // === is rejected by the .when() guard (only !== and != are allowed)
      "const x = a === b ? c : d;",
    ],
    invalid: [
      {
        // !== → === with swapped branches
        code: "const x = a !== b ? c : d;",
        errors: [{ messageId: "match" }],
        output: "const x = a === b ? d : c;",
      },
      {
        // != → == with swapped branches
        code: "const x = a != b ? c : d;",
        errors: [{ messageId: "match" }],
        output: "const x = a == b ? d : c;",
      },
    ],
  }
);
