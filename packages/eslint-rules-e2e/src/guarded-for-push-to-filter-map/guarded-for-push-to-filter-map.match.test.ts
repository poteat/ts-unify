import { match, extractPatterns } from "@ts-unify/core";
import { guardedForPushToFilterMap } from "@ts-unify/rules";

describe("guardedForPushToFilterMap matching", () => {
  const rule = extractPatterns(guardedForPushToFilterMap)[0]!;

  it("extracts as a BlockStatement pattern", () => {
    expect(rule.tag).toBe("BlockStatement");
  });

  it("matches const r = []; for (...) if (...) r.push(...)", () => {
    const ast = {
      type: "BlockStatement",
      body: [
        // emptyArrayDecl: const r = []
        {
          type: "VariableDeclaration",
          kind: "const",
          declarations: [
            {
              type: "VariableDeclarator",
              id: { type: "Identifier", name: "r" },
              init: { type: "ArrayExpression", elements: [] },
            },
          ],
        },
        // guardedFor: for (const item of items) { if (cond) { r.push(val) } }
        {
          type: "ForOfStatement",
          left: {
            type: "VariableDeclaration",
            kind: "const",
            declarations: [
              { type: "VariableDeclarator", id: { type: "Identifier", name: "item" } },
            ],
          },
          right: { type: "Identifier", name: "items" },
          body: {
            type: "BlockStatement",
            body: [
              {
                type: "IfStatement",
                test: { type: "Identifier", name: "cond" },
                consequent: {
                  type: "ExpressionStatement",
                  expression: {
                    type: "CallExpression",
                    callee: {
                      type: "MemberExpression",
                      object: { type: "Identifier", name: "r" },
                      property: { type: "Identifier", name: "push" },
                    },
                    arguments: [{ type: "Identifier", name: "val" }],
                  },
                },
                alternate: null,
              },
            ],
          },
        },
      ],
    };

    const bag = match(ast, rule.pattern);
    expect(bag).not.toBeNull();
    expect(bag!.source).toEqual({ type: "Identifier", name: "items" });
    expect(bag!.condition).toEqual({ type: "Identifier", name: "cond" });
    expect(bag!.before).toEqual([]);
    expect(bag!.after).toEqual([]);
  });

  it("matches with before/after statements", () => {
    const ast = {
      type: "BlockStatement",
      body: [
        { type: "ExpressionStatement", expression: { type: "Identifier", name: "preamble" } },
        {
          type: "VariableDeclaration",
          kind: "const",
          declarations: [
            {
              type: "VariableDeclarator",
              id: { type: "Identifier", name: "r" },
              init: { type: "ArrayExpression", elements: [] },
            },
          ],
        },
        {
          type: "ForOfStatement",
          left: {
            type: "VariableDeclaration",
            kind: "const",
            declarations: [
              { type: "VariableDeclarator", id: { type: "Identifier", name: "x" } },
            ],
          },
          right: { type: "Identifier", name: "xs" },
          body: {
            type: "IfStatement",
            test: { type: "Identifier", name: "ok" },
            consequent: {
              type: "ExpressionStatement",
              expression: {
                type: "CallExpression",
                callee: {
                  type: "MemberExpression",
                  object: { type: "Identifier", name: "r" },
                  property: { type: "Identifier", name: "push" },
                },
                arguments: [{ type: "Identifier", name: "x" }],
              },
            },
            alternate: null,
          },
        },
        { type: "ExpressionStatement", expression: { type: "Identifier", name: "epilogue" } },
      ],
    };

    const bag = match(ast, rule.pattern);
    expect(bag).not.toBeNull();
    expect(bag!.before).toHaveLength(1);
    expect(bag!.after).toHaveLength(1);
  });

  it("rejects a BlockStatement whose body is empty", () => {
    const ast = {
      type: "BlockStatement",
      body: [],
    };

    expect(match(ast, rule.pattern)).toBeNull();
  });
});
