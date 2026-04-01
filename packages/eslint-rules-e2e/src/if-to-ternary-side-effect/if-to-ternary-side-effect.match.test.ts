import { match, extractPatterns } from "@ts-unify/engine";
import { ifToTernarySideEffect } from "@ts-unify/rules";

describe("ifToTernarySideEffect matching", () => {
  const rule = extractPatterns(ifToTernarySideEffect)[0]!;

  it("extracts as an IfStatement pattern", () => {
    expect(rule.tag).toBe("IfStatement");
  });

  it("matches if (c) { expr1; } else { expr2; }", () => {
    const ast = {
      type: "IfStatement",
      test: { type: "Identifier", name: "cond" },
      consequent: {
        type: "BlockStatement",
        body: [{ type: "ExpressionStatement", expression: { type: "Identifier", name: "a" } }],
      },
      alternate: {
        type: "BlockStatement",
        body: [{ type: "ExpressionStatement", expression: { type: "Identifier", name: "b" } }],
      },
    };

    const bag = match(ast, rule.pattern);
    expect(bag).not.toBeNull();
    expect(bag!.test).toEqual({ type: "Identifier", name: "cond" });
  });

  it("matches if (c) expr1; else expr2; (blockless)", () => {
    const ast = {
      type: "IfStatement",
      test: { type: "Identifier", name: "cond" },
      consequent: { type: "ExpressionStatement", expression: { type: "Identifier", name: "a" } },
      alternate: { type: "ExpressionStatement", expression: { type: "Identifier", name: "b" } },
    };

    const bag = match(ast, rule.pattern);
    expect(bag).not.toBeNull();
  });

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

  it("rejects when branches are not expression statements", () => {
    const ast = {
      type: "IfStatement",
      test: { type: "Identifier", name: "flag" },
      consequent: { type: "VariableDeclaration", kind: "const", declarations: [] },
      alternate: { type: "VariableDeclaration", kind: "let", declarations: [] },
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });
});
