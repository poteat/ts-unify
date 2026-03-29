// eslint-disable-next-line @typescript-eslint/no-var-requires
const { RuleTester } = require("@typescript-eslint/rule-tester");
import { createRule } from "@ts-unify/eslint";
import { typeofUndefinedToNullishCheck } from "@ts-unify/rules";

const tester = new RuleTester({
  languageOptions: {
    parser: require("@typescript-eslint/parser"),
  },
});

tester.run(
  "typeof-undefined",
  createRule(typeofUndefinedToNullishCheck, {
    message: "Use == null instead of typeof === 'undefined'",
  }),
  {
    valid: [
      "typeof x === 'string';",
      "x === undefined;",
    ],
    invalid: [
      {
        code: "typeof x === 'undefined';",
        errors: [{ messageId: "match" }],
      },
      {
        code: "typeof foo == 'undefined';",
        errors: [{ messageId: "match" }],
      },
    ],
  }
);
