// eslint-disable-next-line @typescript-eslint/no-var-requires
const { RuleTester } = require("@typescript-eslint/rule-tester");
import { createRule } from "@ts-unify/eslint";
import { addReturnToBlock } from "@ts-unify/rules";

const tester = new RuleTester({
  languageOptions: {
    parser: require("@typescript-eslint/parser"),
  },
});

tester.run(
  "add-return-to-block",
  createRule(addReturnToBlock, {
    message: "Add return to single-expression function body",
  }),
  {
    valid: [
      "function foo() { return bar(); }",
      "function foo() { a(); b(); }",
      "const x = () => bar();",
      "if (true) { bar(); }",
    ],
    invalid: [
      {
        code: "function foo() { bar(); }",
        errors: [{ messageId: "match" }],
      },
      {
        code: "const f = function() { doSomething(); };",
        errors: [{ messageId: "match" }],
      },
      {
        code: "const f = () => { doSomething(); };",
        errors: [{ messageId: "match" }],
      },
    ],
  }
);
