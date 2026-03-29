import { match, extractPattern } from "@ts-unify/eslint";
import { collapseNullGuard } from "@ts-unify/rules";

describe("collapseNullGuard matching", () => {
  const rule = extractPattern(collapseNullGuard)!;

  it("extracts as a BlockStatement pattern", () => {
    expect(rule.tag).toBe("BlockStatement");
  });

  it("matches if (x === null) return def; return x;", () => {
    const ast = {
      type: "BlockStatement",
      body: [
        // leading statements (spread capture)
        { type: "ExpressionStatement", expression: { type: "Identifier", name: "setup" } },
        // nullCheck: if (x === null) return def;
        {
          type: "IfStatement",
          test: {
            type: "BinaryExpression",
            operator: "===",
            left: { type: "Identifier", name: "x" },
            right: { type: "Literal", value: null },
          },
          consequent: {
            type: "ReturnStatement",
            argument: { type: "Identifier", name: "def" },
          },
          alternate: null,
        },
        // returnOfValue: return x; (or return x as T;)
        {
          type: "ReturnStatement",
          argument: { type: "Identifier", name: "x" },
        },
      ],
    };

    const bag = match(ast, rule.pattern);
    expect(bag).not.toBeNull();
    expect(bag!.value).toEqual({ type: "Identifier", name: "x" });
    expect(bag!.fallback).toEqual({ type: "Identifier", name: "def" });
  });

  it("matches with no leading statements", () => {
    const ast = {
      type: "BlockStatement",
      body: [
        {
          type: "IfStatement",
          test: {
            type: "BinaryExpression",
            operator: "===",
            left: { type: "Identifier", name: "val" },
            right: { type: "Literal", value: null },
          },
          consequent: {
            type: "ReturnStatement",
            argument: { type: "Literal", value: 0 },
          },
          alternate: null,
        },
        {
          type: "ReturnStatement",
          argument: { type: "Identifier", name: "val" },
        },
      ],
    };

    const bag = match(ast, rule.pattern);
    expect(bag).not.toBeNull();
    expect(bag!.body).toEqual([]);
  });

  it("rejects when null check has wrong operator", () => {
    const ast = {
      type: "BlockStatement",
      body: [
        {
          type: "IfStatement",
          test: {
            type: "BinaryExpression",
            operator: "!==",
            left: { type: "Identifier", name: "x" },
            right: { type: "Literal", value: null },
          },
          consequent: {
            type: "ReturnStatement",
            argument: { type: "Identifier", name: "def" },
          },
          alternate: null,
        },
        {
          type: "ReturnStatement",
          argument: { type: "Identifier", name: "x" },
        },
      ],
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });

  it("rejects a BlockStatement whose body is not an array", () => {
    const ast = {
      type: "BlockStatement",
      body: "not-an-array",
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });
});
