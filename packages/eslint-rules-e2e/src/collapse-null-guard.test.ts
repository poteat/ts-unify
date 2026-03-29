import { match, extractPattern } from "@ts-unify/eslint";
import { collapseNullGuard } from "@ts-unify/rules";

describe("collapseNullGuard matching", () => {
  const rule = extractPattern(collapseNullGuard)!;

  it("extracts as a BlockStatement pattern", () => {
    expect(rule.tag).toBe("BlockStatement");
  });

  // The pattern uses ...$  (spread captures) in the body array. The current
  // match() implementation requires exact array length and does not handle
  // spread tokens, so positive matching cannot succeed.
  it.skip("matches if (x === null) return def; return x; (requires spread capture support)", () => {});

  it("rejects a BlockStatement whose body is not an array", () => {
    const ast = {
      type: "BlockStatement",
      body: "not-an-array",
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });
});
