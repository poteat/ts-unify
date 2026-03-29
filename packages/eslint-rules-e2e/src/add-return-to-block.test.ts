import { match, extractPattern } from "@ts-unify/eslint";
import { addReturnToBlock } from "@ts-unify/rules";

describe("addReturnToBlock matching", () => {
  const rule = extractPattern(addReturnToBlock)!;

  it("extracts as a BlockStatement pattern", () => {
    expect(rule.tag).toBe("BlockStatement");
  });

  it("matches function() { expr(); }", () => {
    const ast = {
      type: "BlockStatement",
      parent: { type: "FunctionDeclaration" },
      body: [
        {
          type: "ExpressionStatement",
          expression: { type: "CallExpression", callee: { type: "Identifier", name: "fn" }, arguments: [] },
        },
      ],
    };

    const bag = match(ast, rule.pattern);
    expect(bag).not.toBeNull();
    expect(bag!.expression).toEqual(ast.body[0].expression);
  });

  it("matches arrow function body", () => {
    const ast = {
      type: "BlockStatement",
      parent: { type: "ArrowFunctionExpression" },
      body: [
        {
          type: "ExpressionStatement",
          expression: { type: "Identifier", name: "x" },
        },
      ],
    };

    const bag = match(ast, rule.pattern);
    expect(bag).not.toBeNull();
  });

  it("rejects when parent is not a function", () => {
    const ast = {
      type: "BlockStatement",
      parent: { type: "IfStatement" },
      body: [
        {
          type: "ExpressionStatement",
          expression: { type: "Identifier", name: "x" },
        },
      ],
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });

  it("rejects a node whose body has wrong length", () => {
    const ast = {
      type: "BlockStatement",
      parent: { type: "FunctionDeclaration" },
      body: [
        { type: "ExpressionStatement", expression: { type: "Identifier", name: "a" } },
        { type: "ExpressionStatement", expression: { type: "Identifier", name: "b" } },
      ],
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });

  it("rejects a node whose single body element is not ExpressionStatement", () => {
    const ast = {
      type: "BlockStatement",
      parent: { type: "FunctionDeclaration" },
      body: [
        { type: "ReturnStatement", argument: { type: "Identifier", name: "x" } },
      ],
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });
});
