import { match, extractPattern } from "@ts-unify/eslint";
import { guardedForPushToFilterMap } from "@ts-unify/rules";

describe("guardedForPushToFilterMap matching", () => {
  const rule = extractPattern(guardedForPushToFilterMap)!;

  it("extracts as a BlockStatement pattern", () => {
    expect(rule.tag).toBe("BlockStatement");
  });

  // The pattern uses ...$("before") and ...$("after") spread captures in
  // the body array, and U.maybeBlock for the for-loop body and push
  // consequent. The current match() does not support spread captures or
  // the maybeBlock pseudo-type.
  it.skip("matches const r = []; for (...) if (...) r.push(...) (requires spread and maybeBlock support)", () => {});

  it("rejects a BlockStatement whose body is empty", () => {
    const ast = {
      type: "BlockStatement",
      body: [],
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });
});
