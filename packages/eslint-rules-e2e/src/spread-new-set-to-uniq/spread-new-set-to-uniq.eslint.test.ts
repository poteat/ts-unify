// eslint-disable-next-line @typescript-eslint/no-var-requires
const { RuleTester } = require("@typescript-eslint/rule-tester");
import { createRule } from "@ts-unify/eslint";
import { spreadNewSetToUniq } from "@ts-unify/rules";

const tester = new RuleTester({
  languageOptions: {
    parser: require("@typescript-eslint/parser"),
  },
});

tester.run(
  "spread-new-set-to-uniq",
  createRule(spreadNewSetToUniq, {
    message: "Use uniq() instead of [...new Set()]",
    fix: true,
  }),
  {
    valid: [
      "const x = new Set(arr);",
      "const x = [...arr];",
      "const x = Array.from(new Set(arr));",
    ],
    invalid: [
      {
        code: "const x = [...new Set(arr)];",
        errors: [{ messageId: "match" }],
        output: "const x = uniq(arr);",
      },
    ],
  }
);
