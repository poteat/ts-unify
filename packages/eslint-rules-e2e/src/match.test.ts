import { match, extractPattern } from "@ts-unify/eslint";
import {
  spreadNewSetToUniq,
  guardAndAccessToOptionalChain,
  typeofUndefinedToNullishCheck,
} from "@ts-unify/rules";

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

describe("typeofUndefinedToNullishCheck matching", () => {
  const rule = extractPattern(typeofUndefinedToNullishCheck)!;

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
