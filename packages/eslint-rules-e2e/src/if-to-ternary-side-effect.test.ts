import { match, extractPattern } from "@ts-unify/eslint";
import { ifToTernarySideEffect } from "@ts-unify/rules";

describe("ifToTernarySideEffect matching", () => {
  const rule = extractPattern(ifToTernarySideEffect)!;

  it("extracts as an IfStatement pattern", () => {
    expect(rule.tag).toBe("IfStatement");
  });

  // Same issue as ifReturnToTernary: bare $ for test and expressions, plus
  // U.maybeBlock (with .seal()) for both branches.
  it.skip("matches if (c) expr1; else expr2; (requires bare-$ and maybeBlock support)", () => {});

  it("rejects an IfStatement with null alternate", () => {
    const ast = {
      type: "IfStatement",
      test: { type: "Identifier", name: "flag" },
      consequent: {
        type: "ExpressionStatement",
        expression: { type: "Identifier", name: "a" },
      },
      alternate: null,
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });

  it("rejects when consequent is wrong AST type for maybeBlock", () => {
    const ast = {
      type: "IfStatement",
      test: { type: "Identifier", name: "flag" },
      consequent: { type: "VariableDeclaration", kind: "const", declarations: [] },
      alternate: { type: "VariableDeclaration", kind: "let", declarations: [] },
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });
});
