import { match, extractPattern } from "@ts-unify/eslint";
import { guardAndAccessToOptionalChain } from "@ts-unify/rules";

describe("guardAndAccessToOptionalChain matching", () => {
  const rule = extractPattern(guardAndAccessToOptionalChain)!;

  it("matches obj && obj.prop", () => {
    const obj = { type: "Identifier", name: "obj" };
    const ast = {
      type: "LogicalExpression",
      operator: "&&",
      left: obj,
      right: {
        type: "MemberExpression",
        object: obj,
        property: { type: "Identifier", name: "prop" },
        computed: false,
        optional: false,
      },
    };

    const bag = match(ast, rule.pattern);
    expect(bag).not.toBeNull();
    expect(bag!.obj).toEqual(obj);
    expect(bag!.prop).toEqual({ type: "Identifier", name: "prop" });
  });

  it("rejects obj || obj.prop", () => {
    const obj = { type: "Identifier", name: "obj" };
    const ast = {
      type: "LogicalExpression",
      operator: "||",
      left: obj,
      right: {
        type: "MemberExpression",
        object: obj,
        property: { type: "Identifier", name: "prop" },
        computed: false,
        optional: false,
      },
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });
});
