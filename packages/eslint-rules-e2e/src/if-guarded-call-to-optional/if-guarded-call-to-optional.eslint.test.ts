// eslint-disable-next-line @typescript-eslint/no-var-requires
const { RuleTester } = require("@typescript-eslint/rule-tester");
import { createRule } from "@ts-unify/eslint";
import { ifGuardedCallToOptional } from "@ts-unify/rules";

const tester = new RuleTester({
  languageOptions: {
    parser: require("@typescript-eslint/parser"),
  },
});

tester.run(
  "if-guarded-call-to-optional",
  createRule(ifGuardedCallToOptional, {
    message: "Use optional call instead of if-guarded call",
  }),
  {
    valid: [
      "fn?.(arg1, arg2);",
      "if (fn) { fn(arg); } else { fallback(); }",
      "if (cond) { return x; }",
    ],
    invalid: [
      {
        code: "if (fn) { fn(arg1, arg2); }",
        errors: [{ messageId: "match" }],
        output: "fn?.(arg1, arg2);",
      },
      {
        code: "if (callback) { callback(); }",
        errors: [{ messageId: "match" }],
        output: "callback?.();",
      },
      {
        code: "if (handler) handler(event);",
        errors: [{ messageId: "match" }],
        output: "handler?.(event);",
      },
    ],
  }
);
