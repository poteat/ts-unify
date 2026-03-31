import { match, extractPatterns } from "@ts-unify/core";
import { arrayFromMapToArrayFrom } from "@ts-unify/rules";

describe("arrayFromMapToArrayFrom matching", () => {
  const rule = extractPatterns(arrayFromMapToArrayFrom)[0]!;

  it("extracts as a CallExpression pattern", () => {
    expect(rule.tag).toBe("CallExpression");
  });

  it("matches Array.from(iterable).map(fn)", () => {
    const iterable = { type: "Identifier", name: "items" };
    const mapFn = {
      type: "ArrowFunctionExpression",
      params: [{ type: "Identifier", name: "x" }],
      body: { type: "Identifier", name: "x" },
    };

    const ast = {
      type: "CallExpression",
      callee: {
        type: "MemberExpression",
        object: {
          type: "CallExpression",
          callee: {
            type: "MemberExpression",
            object: { type: "Identifier", name: "Array" },
            property: { type: "Identifier", name: "from" },
            computed: false,
            optional: false,
          },
          arguments: [iterable],
          optional: false,
        },
        property: { type: "Identifier", name: "map" },
        computed: false,
        optional: false,
      },
      arguments: [mapFn],
      optional: false,
    };

    const bag = match(ast, rule.pattern);
    expect(bag).not.toBeNull();
    expect(bag!.iterable).toEqual(iterable);
    expect(bag!.mapFn).toEqual(mapFn);
  });

  it("rejects Array.from(iterable).filter(fn) (wrong method)", () => {
    const ast = {
      type: "CallExpression",
      callee: {
        type: "MemberExpression",
        object: {
          type: "CallExpression",
          callee: {
            type: "MemberExpression",
            object: { type: "Identifier", name: "Array" },
            property: { type: "Identifier", name: "from" },
            computed: false,
            optional: false,
          },
          arguments: [{ type: "Identifier", name: "items" }],
          optional: false,
        },
        property: { type: "Identifier", name: "filter" },
        computed: false,
        optional: false,
      },
      arguments: [{ type: "Identifier", name: "fn" }],
      optional: false,
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });

  it("rejects List.from(iterable).map(fn) (wrong receiver)", () => {
    const ast = {
      type: "CallExpression",
      callee: {
        type: "MemberExpression",
        object: {
          type: "CallExpression",
          callee: {
            type: "MemberExpression",
            object: { type: "Identifier", name: "List" },
            property: { type: "Identifier", name: "from" },
            computed: false,
            optional: false,
          },
          arguments: [{ type: "Identifier", name: "items" }],
          optional: false,
        },
        property: { type: "Identifier", name: "map" },
        computed: false,
        optional: false,
      },
      arguments: [{ type: "Identifier", name: "fn" }],
      optional: false,
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });

  it("rejects optional chaining Array.from(iterable)?.map(fn)", () => {
    const ast = {
      type: "CallExpression",
      callee: {
        type: "MemberExpression",
        object: {
          type: "CallExpression",
          callee: {
            type: "MemberExpression",
            object: { type: "Identifier", name: "Array" },
            property: { type: "Identifier", name: "from" },
            computed: false,
            optional: false,
          },
          arguments: [{ type: "Identifier", name: "items" }],
          optional: false,
        },
        property: { type: "Identifier", name: "map" },
        computed: false,
        optional: true,
      },
      arguments: [{ type: "Identifier", name: "fn" }],
      optional: false,
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });
});
