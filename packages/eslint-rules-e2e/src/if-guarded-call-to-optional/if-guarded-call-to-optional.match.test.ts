import { match, extractPattern } from "@ts-unify/eslint";
import { ifGuardedCallToOptional } from "@ts-unify/rules";

describe("ifGuardedCallToOptional matching", () => {
  const rule = extractPattern(ifGuardedCallToOptional)!;

  it("extracts as an IfStatement pattern", () => {
    expect(rule.tag).toBe("IfStatement");
  });

  it("matches if (fn) { fn(arg1, arg2); }", () => {
    const ast = {
      type: "IfStatement",
      test: { type: "Identifier", name: "fn" },
      consequent: {
        type: "BlockStatement",
        body: [
          {
            type: "ExpressionStatement",
            expression: {
              type: "CallExpression",
              callee: { type: "Identifier", name: "fn" },
              arguments: [{ type: "Literal", value: 1 }],
            },
          },
        ],
      },
      alternate: null,
    };

    const bag = match(ast, rule.pattern);
    expect(bag).not.toBeNull();
    expect(bag!.callee).toEqual({ type: "Identifier", name: "fn" });
  });

  it("matches if (fn) fn(); (blockless)", () => {
    const ast = {
      type: "IfStatement",
      test: { type: "Identifier", name: "fn" },
      consequent: {
        type: "ExpressionStatement",
        expression: {
          type: "CallExpression",
          callee: { type: "Identifier", name: "fn" },
          arguments: [],
        },
      },
      alternate: null,
    };

    const bag = match(ast, rule.pattern);
    expect(bag).not.toBeNull();
  });

  it("rejects if (fn) { fn(args); } else { ... } (alternate must be null)", () => {
    const ast = {
      type: "IfStatement",
      test: { type: "Identifier", name: "fn" },
      consequent: {
        type: "BlockStatement",
        body: [
          {
            type: "ExpressionStatement",
            expression: {
              type: "CallExpression",
              callee: { type: "Identifier", name: "fn" },
              arguments: [],
            },
          },
        ],
      },
      alternate: { type: "BlockStatement", body: [] },
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });

  it("rejects when consequent is not a call expression", () => {
    const ast = {
      type: "IfStatement",
      test: { type: "Identifier", name: "fn" },
      consequent: { type: "ReturnStatement", argument: null },
      alternate: null,
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });
});
