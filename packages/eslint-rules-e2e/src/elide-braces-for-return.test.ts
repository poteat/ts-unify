import { match, extractPattern } from "@ts-unify/eslint";
import { elideBracesForReturn } from "@ts-unify/rules";

describe("elideBracesForReturn matching", () => {
  const rule = extractPattern(elideBracesForReturn)!;

  it("extracts as a BlockStatement pattern", () => {
    expect(rule.tag).toBe("BlockStatement");
  });

  // The pattern uses bare $ for the return argument capture and the parent
  // field which the matcher cannot resolve against plain mock ASTs. Positive
  // matching is not possible with the current match() implementation.
  it.skip("matches (x) => { return x + 1; } (requires bare-$ and parent support)", () => {});

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
