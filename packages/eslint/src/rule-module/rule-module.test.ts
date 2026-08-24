import type { RuleTester } from "eslint";
import { U, $ } from "@ts-unify/core";
import { createRule } from "../create-rule";

/** The rule type `RuleTester.run` accepts. */
type TesterRule = Parameters<RuleTester["run"]>[1];

const id = U.Identifier({ name: $("n") });

describe("RuleModule", () => {
  it("is the rule type RuleTester.run takes", () => {
    const rule: TesterRule = createRule(id);
    expect(rule.meta?.type).toBe("suggestion");
  });
});
