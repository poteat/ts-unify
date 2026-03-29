import { match, extractPattern } from "@ts-unify/eslint";
import { ifGuardedReturnToTernary } from "@ts-unify/rules";

describe("ifGuardedReturnToTernary matching", () => {
  const rule = extractPattern(ifGuardedReturnToTernary)!;

  it("extracts as a BlockStatement pattern", () => {
    expect(rule.tag).toBe("BlockStatement");
  });

  it("matches if (cond) { return a; } return b;", () => {
    const ast = {
      type: "BlockStatement",
      body: [
        {
          type: "IfStatement",
          test: { type: "Identifier", name: "cond" },
          consequent: {
            type: "BlockStatement",
            body: [
              { type: "ReturnStatement", argument: { type: "Literal", value: 1 } },
            ],
          },
          alternate: null,
        },
        {
          type: "ReturnStatement",
          argument: { type: "Literal", value: 2 },
        },
      ],
    };

    const bag = match(ast, rule.pattern);
    expect(bag).not.toBeNull();
    expect(bag!.test).toEqual({ type: "Identifier", name: "cond" });
    expect(bag!.alternate).toEqual({ type: "Literal", value: 2 });
    expect(bag!.body).toEqual([]);
  });

  it("matches with leading statements", () => {
    const ast = {
      type: "BlockStatement",
      body: [
        { type: "ExpressionStatement", expression: { type: "Identifier", name: "setup" } },
        {
          type: "IfStatement",
          test: { type: "Identifier", name: "cond" },
          consequent: {
            type: "ReturnStatement",
            argument: { type: "Literal", value: "a" },
          },
          alternate: null,
        },
        {
          type: "ReturnStatement",
          argument: { type: "Literal", value: "b" },
        },
      ],
    };

    const bag = match(ast, rule.pattern);
    expect(bag).not.toBeNull();
    expect(bag!.body).toHaveLength(1);
  });

  it("rejects a BlockStatement with an empty body", () => {
    const ast = {
      type: "BlockStatement",
      body: [],
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });

  it("rejects when the if has an else branch", () => {
    const ast = {
      type: "BlockStatement",
      body: [
        {
          type: "IfStatement",
          test: { type: "Identifier", name: "cond" },
          consequent: {
            type: "ReturnStatement",
            argument: { type: "Literal", value: 1 },
          },
          alternate: {
            type: "ReturnStatement",
            argument: { type: "Literal", value: 2 },
          },
        },
        {
          type: "ReturnStatement",
          argument: { type: "Literal", value: 3 },
        },
      ],
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });
});
