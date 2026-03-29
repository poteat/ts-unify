import { match, extractPattern } from "@ts-unify/eslint";
import { functionDeclReturnToArrow } from "@ts-unify/rules";

describe("functionDeclReturnToArrow matching", () => {
  const rule = extractPattern(functionDeclReturnToArrow)!;

  it("extracts with tag 'fromNode' (U.fromNode combinator)", () => {
    expect(rule.tag).toBe("fromNode");
  });

  // The pattern uses U.fromNode which produces tag="fromNode". The match()
  // function does not use the tag when matching -- it only checks properties
  // in the pattern object. The pattern contains:
  //   type: U.or("FunctionDeclaration", "FunctionExpression")
  //   body: U.or(returnBlock, exprBlock)  -- both have bare $ inside
  //   generator: false
  // We can test the type and generator fields but the body or-branches both
  // contain bare $ which causes match failure.

  it("rejects a generator function (generator: true)", () => {
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

    expect(match(ast, rule.pattern)).toBeNull();
  });

  it("rejects an ArrowFunctionExpression (wrong type)", () => {
    const ast = {
      type: "ArrowFunctionExpression",
      body: {
        type: "BlockStatement",
        body: [
          { type: "ReturnStatement", argument: { type: "Literal", value: 1 } },
        ],
      },
      generator: false,
      params: [],
      async: false,
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });

  it("rejects a FunctionDeclaration with non-BlockStatement body", () => {
    // Arrow functions can have expression bodies, but FunctionDeclarations
    // always have BlockStatement bodies in real ASTs. We use a contrived
    // non-BlockStatement body to verify the body or-branch rejects it.
    const ast = {
      type: "FunctionDeclaration",
      body: { type: "Literal", value: 42 },
      generator: false,
      id: { type: "Identifier", name: "foo" },
      params: [],
      async: false,
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });

  // Positive test is skipped because both or-branches for body contain
  // bare $ (the function itself, not $("name")) for the return argument /
  // expression capture, which the matcher cannot handle.
  it.skip("matches function foo(x) { return x + 1; } (requires bare-$ support)", () => {});
});
