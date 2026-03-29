// eslint-disable-next-line @typescript-eslint/no-var-requires
const { RuleTester } = require("@typescript-eslint/rule-tester");
import { createRule } from "@ts-unify/eslint";
import { guardedForPushToFilterMap } from "@ts-unify/rules";

const tester = new RuleTester({
  languageOptions: {
    parser: require("@typescript-eslint/parser"),
  },
});

tester.run(
  "guarded-for-push-to-filter-map",
  createRule(guardedForPushToFilterMap, {
    message: "Use .filter().map() instead of for-of with guarded push",
  }),
  {
    valid: [
      "const result = items.filter(x => x > 0).map(x => x * 2);",
      "for (const x of items) { result.push(x); }",
      "const r = []; for (const x of items) { r.push(x); }",
    ],
    invalid: [
      {
        code: `function f() {
  const result = [];
  for (const item of items) {
    if (isValid(item)) {
      result.push(transform(item));
    }
  }
}`,
        errors: [{ messageId: "match" }],
      },
      {
        code: `function f() {
  setup();
  const out = [];
  for (const x of xs) {
    if (x > 0) {
      out.push(x * 2);
    }
  }
  cleanup();
}`,
        errors: [{ messageId: "match" }],
      },
    ],
  }
);
