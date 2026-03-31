import { match, extractPatterns } from "@ts-unify/core";
import { typeofUndefinedToNullishCheck } from "@ts-unify/rules";

describe("typeofUndefinedToNullishCheck matching", () => {
  const rule = extractPatterns(typeofUndefinedToNullishCheck)[0]!;

  it("matches typeof x === 'undefined'", () => {
    const ast = {
      type: "BinaryExpression",
      operator: "===",
      left: {
        type: "UnaryExpression",
        operator: "typeof",
        argument: { type: "Identifier", name: "x" },
      },
      right: { type: "Literal", value: "undefined" },
    };

    const bag = match(ast, rule.pattern);
    expect(bag).not.toBeNull();
    expect(bag!.expr).toEqual({ type: "Identifier", name: "x" });
  });

  it("rejects typeof x === 'string'", () => {
    const ast = {
      type: "BinaryExpression",
      operator: "===",
      left: {
        type: "UnaryExpression",
        operator: "typeof",
        argument: { type: "Identifier", name: "x" },
      },
      right: { type: "Literal", value: "string" },
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });
});
