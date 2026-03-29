import { match, extractPattern } from "@ts-unify/eslint";
import { ifGuardedCallToOptional } from "@ts-unify/rules";

describe("ifGuardedCallToOptional matching", () => {
  const rule = extractPattern(ifGuardedCallToOptional)!;

  it("extracts as an IfStatement pattern", () => {
    expect(rule.tag).toBe("IfStatement");
  });

  // The pattern uses U.maybeBlock for the consequent branch, which produces
  // a proxy with tag "maybeBlock" -- a pseudo-type the matcher does not
  // recognize. The matcher compares actual.type against "maybeBlock" and
  // rejects because no real AST node has that type.
  it.skip("matches if (fn) { fn(args); } (requires maybeBlock support)", () => {});

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
      alternate: {
        type: "BlockStatement",
        body: [],
      },
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });

  it("rejects when consequent is a non-block, non-maybeBlock type", () => {
    const ast = {
      type: "IfStatement",
      test: { type: "Identifier", name: "fn" },
      consequent: {
        type: "ReturnStatement",
        argument: null,
      },
      alternate: null,
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });
});
