// eslint-disable-next-line @typescript-eslint/no-var-requires
const { RuleTester } = require("@typescript-eslint/rule-tester");
import { createRule } from "@ts-unify/eslint";
import {
  spreadNewSetToUniq,
  typeofUndefinedToNullishCheck,
  guardAndAccessToOptionalChain,
} from "@ts-unify/rules";

const tester = new RuleTester({
  languageOptions: {
    parser: require("@typescript-eslint/parser"),
  },
});

tester.run(
  "spread-new-set-to-uniq",
  createRule(spreadNewSetToUniq, {
    message: "Use uniq() instead of [...new Set()]",
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
      },
    ],
  }
);

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

tester.run(
  "guard-and-access",
  createRule(guardAndAccessToOptionalChain, {
    message: "Use optional chaining",
  }),
  {
    valid: [
      "obj?.prop;",
      "obj || obj.prop;",
      // TODO: "obj && other.prop;" should be valid (duplicate capture equality not enforced yet)
    ],
    invalid: [
      {
        code: "obj && obj.prop;",
        errors: [{ messageId: "match" }],
      },
    ],
  }
);
