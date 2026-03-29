import { match, extractPattern } from "@ts-unify/eslint";
import { elideBracesForReturn } from "@ts-unify/rules";

describe("elideBracesForReturn matching", () => {
  const rule = extractPattern(elideBracesForReturn)!;

  it("extracts as a BlockStatement pattern", () => {
    expect(rule.tag).toBe("BlockStatement");
  });

  it("matches (x) => { return x + 1; }", () => {
    const ast = {
      type: "BlockStatement",
      parent: { type: "ArrowFunctionExpression" },
      body: [
        {
          type: "ReturnStatement",
          argument: { type: "BinaryExpression", operator: "+", left: { type: "Identifier", name: "x" }, right: { type: "Literal", value: 1 } },
        },
      ],
    };

    const bag = match(ast, rule.pattern);
    expect(bag).not.toBeNull();
    expect(bag!.argument).toEqual(ast.body[0].argument);
  });

  it("rejects when parent is not ArrowFunctionExpression", () => {
    const ast = {
      type: "BlockStatement",
      parent: { type: "FunctionDeclaration" },
      body: [
        { type: "ReturnStatement", argument: { type: "Literal", value: 1 } },
      ],
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });

  it("rejects a block with two statements", () => {
    const ast = {
      type: "BlockStatement",
      parent: { type: "ArrowFunctionExpression" },
      body: [
        { type: "ReturnStatement", argument: { type: "Literal", value: 1 } },
        { type: "ReturnStatement", argument: { type: "Literal", value: 2 } },
      ],
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });

  it("rejects a block whose single statement is not ReturnStatement", () => {
    const ast = {
      type: "BlockStatement",
      parent: { type: "ArrowFunctionExpression" },
      body: [
        { type: "ExpressionStatement", expression: { type: "Literal", value: 1 } },
      ],
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });
});
