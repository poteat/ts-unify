// eslint-disable-next-line @typescript-eslint/no-var-requires
const { RuleTester } = require("@typescript-eslint/rule-tester");
import { createRule } from "@ts-unify/eslint";
import { objectAssignToSpread } from "@ts-unify/rules";

const tester = new RuleTester({
  languageOptions: {
    parser: require("@typescript-eslint/parser"),
  },
});

tester.run(
  "object-assign-to-spread",
  createRule(objectAssignToSpread, {
    message: "Use object spread instead of Object.assign",
  }),
  {
    valid: [
      "const x = { ...a, ...b };",
      "Object.assign(target, source);",
      "Object.create({});",
      "Reflect.assign({}, a);",
    ],
    invalid: [
      {
        code: "const x = Object.assign({}, a, b);",
        errors: [{ messageId: "match" }],
      },
      {
        code: "const x = Object.assign({}, source);",
        errors: [{ messageId: "match" }],
      },
    ],
  }
);
