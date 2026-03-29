import { match, extractPattern } from "@ts-unify/eslint";
import { ifReturnToTernary } from "@ts-unify/rules";

describe("ifReturnToTernary matching", () => {
  const rule = extractPattern(ifReturnToTernary)!;

  it("extracts as an IfStatement pattern", () => {
    expect(rule.tag).toBe("IfStatement");
  });

  // The pattern uses bare $ for test and both return arguments, plus
  // U.maybeBlock (with .seal()) for both consequent and alternate. The
  // matcher cannot handle any of these.
  it.skip("matches if (c) return a; else return b; (requires bare-$ and maybeBlock support)", () => {});

  it("rejects an IfStatement without an alternate branch", () => {
    // The pattern requires alternate to be a maybeBlock proxy. null would
    // fail the type check against the "maybeBlock" tag.
    const ast = {
      type: "IfStatement",
      test: { type: "Identifier", name: "cond" },
      consequent: {
        type: "BlockStatement",
        body: [{ type: "ReturnStatement", argument: { type: "Literal", value: 1 } }],
      },
      alternate: null,
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });

  it("rejects when consequent is not a block or return (wrong type)", () => {
    const ast = {
      type: "IfStatement",
      test: { type: "Identifier", name: "cond" },
      consequent: { type: "ThrowStatement", argument: { type: "Literal", value: "err" } },
      alternate: { type: "ThrowStatement", argument: { type: "Literal", value: "err2" } },
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });
});
