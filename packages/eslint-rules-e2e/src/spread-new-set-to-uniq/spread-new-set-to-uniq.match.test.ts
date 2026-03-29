import { match, extractPattern } from "@ts-unify/eslint";
import { spreadNewSetToUniq } from "@ts-unify/rules";

describe("spreadNewSetToUniq matching", () => {
  const rule = extractPattern(spreadNewSetToUniq)!;

  it("matches [...new Set(arr)]", () => {
    const ast = {
      type: "ArrayExpression",
      elements: [
        {
          type: "SpreadElement",
          argument: {
            type: "NewExpression",
            callee: { type: "Identifier", name: "Set" },
            arguments: [{ type: "Identifier", name: "arr" }],
          },
        },
      ],
    };

    const bag = match(ast, rule.pattern);
    expect(bag).not.toBeNull();
    expect(bag!.array).toEqual({ type: "Identifier", name: "arr" });
  });

  it("rejects [...new Map(arr)]", () => {
    const ast = {
      type: "ArrayExpression",
      elements: [
        {
          type: "SpreadElement",
          argument: {
            type: "NewExpression",
            callee: { type: "Identifier", name: "Map" },
            arguments: [{ type: "Identifier", name: "arr" }],
          },
        },
      ],
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });

  it("rejects [new Set(arr)] (no spread)", () => {
    const ast = {
      type: "ArrayExpression",
      elements: [
        {
          type: "NewExpression",
          callee: { type: "Identifier", name: "Set" },
          arguments: [{ type: "Identifier", name: "arr" }],
        },
      ],
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });
});
