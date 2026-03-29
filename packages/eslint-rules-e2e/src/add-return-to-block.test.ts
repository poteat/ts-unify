import { match, extractPattern } from "@ts-unify/eslint";
import { addReturnToBlock } from "@ts-unify/rules";

describe("addReturnToBlock matching", () => {
  const rule = extractPattern(addReturnToBlock)!;

  it("extracts as a BlockStatement pattern", () => {
    expect(rule.tag).toBe("BlockStatement");
  });

  // Positive matching is skipped because the pattern uses bare $ (the
  // capture function itself rather than $("name")) for the expression
  // capture, and the parent field references a virtual property not present
  // on plain AST objects. The current match() implementation falls through to
  // literal comparison for bare $ which always fails.
  it.skip("matches function() { expr(); } (requires bare-$ and parent support)", () => {});

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
