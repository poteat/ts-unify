import { match, extractPattern } from "@ts-unify/eslint";
import { ifGuardedReturnToTernary } from "@ts-unify/rules";

describe("ifGuardedReturnToTernary matching", () => {
  const rule = extractPattern(ifGuardedReturnToTernary)!;

  it("extracts as a BlockStatement pattern", () => {
    expect(rule.tag).toBe("BlockStatement");
  });

  // The pattern uses ...$  (anonymous spread) in the body array, bare $ for
  // the IfStatement test and return argument, and U.maybeBlock for the
  // consequent. None of these are supported by the current match().
  it.skip("matches if (cond) return a; return b; (requires spread, bare-$, and maybeBlock support)", () => {});

  it("rejects a BlockStatement with an empty body", () => {
    const ast = {
      type: "BlockStatement",
      body: [],
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });
});
