import { match, extractPatterns } from "@ts-unify/engine";
import { singularFunctionToArrow } from "@ts-unify/rules";

describe("singularFunctionToArrow matching", () => {
  const patterns = extractPatterns(singularFunctionToArrow);

  it("extracts two branches: FunctionDeclaration and FunctionExpression", () => {
    expect(patterns).toHaveLength(2);
    expect(patterns[0].tag).toBe("FunctionDeclaration");
    expect(patterns[1].tag).toBe("FunctionExpression");
  });

  it("matches function foo(x) { return x + 1; }", () => {
    const ast = {
      type: "FunctionDeclaration",
      body: {
        type: "BlockStatement",
        body: [
          { type: "ReturnStatement", argument: { type: "Identifier", name: "x" } },
        ],
      },
      generator: false,
      id: { type: "Identifier", name: "foo" },
      params: [{ type: "Identifier", name: "x" }],
      async: false,
    };

    const bag = match(ast, patterns[0].pattern);
    expect(bag).not.toBeNull();
  });

  it("matches function expression", () => {
    const ast = {
      type: "FunctionExpression",
      body: {
        type: "BlockStatement",
        body: [
          { type: "ReturnStatement", argument: { type: "Literal", value: 42 } },
        ],
      },
      generator: false,
      id: null,
      params: [],
      async: false,
    };

    const bag = match(ast, patterns[1].pattern);
    expect(bag).not.toBeNull();
  });

  it("rejects a generator function", () => {
    const ast = {
      type: "FunctionDeclaration",
      body: {
        type: "BlockStatement",
        body: [
          { type: "ReturnStatement", argument: { type: "Literal", value: 1 } },
        ],
      },
      generator: true,
      id: { type: "Identifier", name: "foo" },
      params: [],
      async: false,
    };

    expect(match(ast, patterns[0].pattern)).toBeNull();
  });

  it("rejects when body is not a block with single return", () => {
    const ast = {
      type: "FunctionDeclaration",
      body: {
        type: "BlockStatement",
        body: [
          { type: "ExpressionStatement", expression: { type: "Identifier", name: "a" } },
          { type: "ReturnStatement", argument: { type: "Identifier", name: "b" } },
        ],
      },
      generator: false,
      id: { type: "Identifier", name: "foo" },
      params: [],
      async: false,
    };

    expect(match(ast, patterns[0].pattern)).toBeNull();
  });
});
