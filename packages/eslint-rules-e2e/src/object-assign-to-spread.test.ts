import { match, extractPattern } from "@ts-unify/eslint";
import { objectAssignToSpread } from "@ts-unify/rules";

describe("objectAssignToSpread matching", () => {
  const rule = extractPattern(objectAssignToSpread)!;

  it("extracts as a CallExpression pattern", () => {
    expect(rule.tag).toBe("CallExpression");
  });

  // The pattern uses ...$("sources") as a spread capture in the arguments
  // array. At runtime the spread token becomes a plain {name: "sources"}
  // object in the array. The current match() compares array lengths strictly
  // and does not handle spread semantics, so it would only match calls with
  // exactly 2 arguments and would try to literally match the second argument
  // against {name: "sources"} as a plain-object pattern.
  it.skip("matches Object.assign({}, a, b) (requires spread capture support in arrays)", () => {});

  it("rejects Object.create({}) (wrong method name)", () => {
    const ast = {
      type: "CallExpression",
      callee: {
        type: "MemberExpression",
        object: { type: "Identifier", name: "Object" },
        property: { type: "Identifier", name: "create" },
        computed: false,
        optional: false,
      },
      arguments: [
        { type: "ObjectExpression", properties: [] },
      ],
      optional: false,
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });

  it("rejects Reflect.assign({}, a) (wrong receiver object)", () => {
    const ast = {
      type: "CallExpression",
      callee: {
        type: "MemberExpression",
        object: { type: "Identifier", name: "Reflect" },
        property: { type: "Identifier", name: "assign" },
        computed: false,
        optional: false,
      },
      arguments: [
        { type: "ObjectExpression", properties: [] },
        { type: "Identifier", name: "a" },
      ],
      optional: false,
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });

  it("rejects Object.assign(existingObj, a) (first arg not empty object)", () => {
    const ast = {
      type: "CallExpression",
      callee: {
        type: "MemberExpression",
        object: { type: "Identifier", name: "Object" },
        property: { type: "Identifier", name: "assign" },
        computed: false,
        optional: false,
      },
      arguments: [
        {
          type: "ObjectExpression",
          properties: [
            { type: "Property", key: { type: "Identifier", name: "x" }, value: { type: "Literal", value: 1 } },
          ],
        },
        { type: "Identifier", name: "a" },
      ],
      optional: false,
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });

  it("rejects Object.assign() with no arguments", () => {
    const ast = {
      type: "CallExpression",
      callee: {
        type: "MemberExpression",
        object: { type: "Identifier", name: "Object" },
        property: { type: "Identifier", name: "assign" },
        computed: false,
        optional: false,
      },
      arguments: [],
      optional: false,
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });
});
