// eslint-disable-next-line @typescript-eslint/no-var-requires
const { RuleTester } = require("@typescript-eslint/rule-tester");
import { createRule } from "@ts-unify/eslint";
import { guardAndAccessToOptionalChain } from "@ts-unify/rules";

const tester = new RuleTester({
  languageOptions: {
    parser: require("@typescript-eslint/parser"),
  },
});

tester.run(
  "guard-and-access",
  createRule(guardAndAccessToOptionalChain, {
    message: "Use optional chaining",
  }),
  {
    valid: [
      "obj?.prop;",
      "obj || obj.prop;",
      "obj && other.prop;",
    ],
    invalid: [
      {
        code: "obj && obj.prop;",
        errors: [{ messageId: "match" }],
      },
    ],
  }
);
