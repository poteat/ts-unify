import { match } from "./match";
import { U, NODE } from "@/ast/builder-map/builder-map";
import { $ } from "@/capture/dollar/dollar";
import { C } from "@/config/config-slot/config-slot";

function extractFirstPattern(proxy: any) {
  const node = proxy[NODE];
  return { tag: node.tag, pattern: node.args[0] ?? {}, chain: node.chain };
}

// Suppress "unused" warnings for destructured bindings used only for assertion
/* eslint-disable @typescript-eslint/no-unused-vars */

describe("match - seal", () => {
  it("re-keys a single inner capture to the parent property name", () => {
    // U.ReturnStatement({ argument: $ }).seal() used inside a parent object
    const sealedReturn = (U as any)
      .ReturnStatement({ argument: $ })
      .seal();

    const pattern = {
      test: $,
      consequent: sealedReturn,
    };

    const ast = {
      type: "IfStatement",
      test: { type: "Identifier", name: "cond" },
      consequent: {
        type: "ReturnStatement",
        argument: { type: "Literal", value: 42 },
      },
    };

    const bag = match(ast, pattern);
    expect(bag).not.toBeNull();
    // The inner capture "argument" should be re-keyed to "consequent"
    expect(bag!.consequent).toEqual({ type: "Literal", value: 42 });
    expect(bag!.argument).toBeUndefined();
    expect(bag!.test).toEqual({ type: "Identifier", name: "cond" });
  });

  it("passes through empty bag when seal has zero captures", () => {
    const sealedLiteral = (U as any)
      .Identifier({ name: "foo" })
      .seal();

    const pattern = { value: sealedLiteral };
    const ast = {
      type: "SomeNode",
      value: { type: "Identifier", name: "foo" },
    };

    const bag = match(ast, pattern);
    expect(bag).not.toBeNull();
    expect(Object.keys(bag!)).toHaveLength(0);
  });

  it("works with maybeBlock + seal (if-return-to-ternary pattern)", () => {
    const anyReturnForm = (U as any)
      .maybeBlock((U as any).ReturnStatement({ argument: $ }))
      .seal();

    const pattern = {
      test: $,
      consequent: anyReturnForm,
      alternate: anyReturnForm,
    };

    // Blocked form
    const ast1 = {
      type: "IfStatement",
      test: { type: "Identifier", name: "cond" },
      consequent: {
        type: "BlockStatement",
        body: [
          {
            type: "ReturnStatement",
            argument: { type: "Literal", value: 1 },
          },
        ],
      },
      alternate: {
        type: "BlockStatement",
        body: [
          {
            type: "ReturnStatement",
            argument: { type: "Literal", value: 2 },
          },
        ],
      },
    };

    const bag1 = match(ast1, pattern);
    expect(bag1).not.toBeNull();
    expect(bag1!.consequent).toEqual({ type: "Literal", value: 1 });
    expect(bag1!.alternate).toEqual({ type: "Literal", value: 2 });
    expect(bag1!.test).toEqual({ type: "Identifier", name: "cond" });

    // Blockless form
    const ast2 = {
      type: "IfStatement",
      test: { type: "Identifier", name: "x" },
      consequent: {
        type: "ReturnStatement",
        argument: { type: "Identifier", name: "a" },
      },
      alternate: {
        type: "ReturnStatement",
        argument: { type: "Identifier", name: "b" },
      },
    };

    const bag2 = match(ast2, pattern);
    expect(bag2).not.toBeNull();
    expect(bag2!.consequent).toEqual({ type: "Identifier", name: "a" });
    expect(bag2!.alternate).toEqual({ type: "Identifier", name: "b" });
  });
});

describe("match - bind", () => {
  it("captures the whole node under 'node' with zero-arg bind()", () => {
    const exprBlock = (U as any)
      .BlockStatement({
        body: [(U as any).ExpressionStatement({ expression: $ })],
      })
      .bind();

    const ast = {
      type: "BlockStatement",
      body: [
        {
          type: "ExpressionStatement",
          expression: { type: "Identifier", name: "x" },
        },
      ],
    };

    const extracted = extractFirstPattern(exprBlock);
    expect(extracted.tag).toBe("BlockStatement");

    // When used as a value in a parent pattern
    const parentPattern = { body: exprBlock };
    const parentAst = { type: "SomeNode", body: ast };
    const bag = match(parentAst, parentPattern);
    expect(bag).not.toBeNull();
    // bind() zero-arg captures under "node"
    expect(bag!.node).toBe(ast);
    // Inner captures (expression) should NOT leak
    expect(bag!.expression).toBeUndefined();
  });

  it("captures the whole node under a custom name with bind('name')", () => {
    const namedBind = (U as any)
      .BlockStatement({
        body: [(U as any).ExpressionStatement({ expression: $ })],
      })
      .bind("myBlock");

    const ast = {
      type: "BlockStatement",
      body: [
        {
          type: "ExpressionStatement",
          expression: { type: "Literal", value: 42 },
        },
      ],
    };

    const parentPattern = { body: namedBind };
    const parentAst = { type: "SomeNode", body: ast };
    const bag = match(parentAst, parentPattern);
    expect(bag).not.toBeNull();
    expect(bag!.myBlock).toBe(ast);
    expect(bag!.expression).toBeUndefined();
  });

  it("still validates structure before binding", () => {
    const bound = (U as any)
      .BlockStatement({
        body: [(U as any).ReturnStatement({ argument: $ })],
      })
      .bind("result");

    const wrongAst = {
      type: "BlockStatement",
      body: [{ type: "ThrowStatement" }],
    };

    const parentPattern = { body: bound };
    const parentAst = { type: "SomeNode", body: wrongAst };
    const bag = match(parentAst, parentPattern);
    expect(bag).toBeNull();
  });
});

describe("match - defaultUndefined", () => {
  it("is a type-level-only modifier ($ already captures null)", () => {
    const returnStmt = (U as any)
      .ReturnStatement({ argument: $ })
      .defaultUndefined();

    const ast = {
      type: "ReturnStatement",
      argument: null,
    };

    const parentPattern = { stmt: returnStmt };
    const parentAst = { type: "SomeNode", stmt: ast };
    const bag = match(parentAst, parentPattern);
    expect(bag).not.toBeNull();
    expect(bag!.argument).toBeNull();
  });

  it("works with seal (captures null, re-keyed)", () => {
    const sealedReturn = (U as any)
      .ReturnStatement({ argument: $ })
      .defaultUndefined()
      .seal();

    const ast = {
      type: "ReturnStatement",
      argument: null,
    };

    const parentPattern = { stmt: sealedReturn };
    const parentAst = { type: "SomeNode", stmt: ast };
    const bag = match(parentAst, parentPattern);
    expect(bag).not.toBeNull();
    // argument is re-keyed to "stmt"
    expect(bag!.stmt).toBeNull();
    expect(bag!.argument).toBeUndefined();
  });

  it("does NOT make the proxy match when the actual node is null", () => {
    // defaultUndefined is about inner captures, not about the node itself
    const sealedReturn = (U as any)
      .maybeBlock((U as any).ReturnStatement({ argument: $ }))
      .defaultUndefined()
      .seal();

    const parentPattern = { alternate: sealedReturn };
    const parentAst = { type: "IfStatement", alternate: null };
    const bag = match(parentAst, parentPattern);
    expect(bag).toBeNull();
  });
});

describe("match - config slots (C)", () => {
  it("matches a config slot value against the config default", () => {
    const pattern = {
      callee: { type: "Identifier", name: C("fn") },
    };

    const chain = [{ method: "config", args: [{ fn: "uniq" }] }];

    const ast = {
      type: "CallExpression",
      callee: { type: "Identifier", name: "uniq" },
    };

    const bag = match(ast, pattern, chain);
    expect(bag).not.toBeNull();
  });

  it("rejects when config slot value doesn't match", () => {
    const pattern = {
      callee: { type: "Identifier", name: C("fn") },
    };

    const chain = [{ method: "config", args: [{ fn: "uniq" }] }];

    const ast = {
      type: "CallExpression",
      callee: { type: "Identifier", name: "map" },
    };

    const bag = match(ast, pattern, chain);
    expect(bag).toBeNull();
  });

  it("works with config slots in arrays", () => {
    const pattern = {
      elements: [C("val")],
    };

    const chain = [{ method: "config", args: [{ val: "hello" }] }];

    const ast = {
      type: "ArrayExpression",
      elements: ["hello"],
    };

    const bag = match(ast, pattern, chain);
    expect(bag).not.toBeNull();
  });

  it("rejects with missing config defaults", () => {
    const pattern = {
      name: C("fn"),
    };

    // No config entry in chain
    const chain: { method: string; args: any[] }[] = [];

    const ast = { type: "Identifier", name: "foo" };
    const bag = match(ast, pattern, chain);
    expect(bag).toBeNull(); // undefined !== "foo"
  });
});

describe("match - combined seal + bind + or", () => {
  it("handles the singular-function-to-arrow pattern (or with seal and bind branches)", () => {
    const returnBlock = (U as any)
      .BlockStatement({
        body: [(U as any).ReturnStatement({ argument: $ }).defaultUndefined()],
      })
      .seal();

    const exprBlock = (U as any)
      .BlockStatement({
        body: [(U as any).ExpressionStatement({ expression: $ })],
      })
      .bind();

    const orPattern = (U as any).or(returnBlock, exprBlock);

    // Test with return block
    const returnAst = {
      type: "BlockStatement",
      body: [
        {
          type: "ReturnStatement",
          argument: { type: "Literal", value: 42 },
        },
      ],
    };

    const parentPattern1 = { body: orPattern };
    const parentAst1 = { type: "SomeNode", body: returnAst };
    const bag1 = match(parentAst1, parentPattern1);
    expect(bag1).not.toBeNull();
    // seal re-keys "argument" to "body"
    expect(bag1!.body).toEqual({ type: "Literal", value: 42 });

    // Test with expression block
    const exprAst = {
      type: "BlockStatement",
      body: [
        {
          type: "ExpressionStatement",
          expression: { type: "Identifier", name: "doStuff" },
        },
      ],
    };

    const parentPattern2 = { body: orPattern };
    const parentAst2 = { type: "SomeNode", body: exprAst };
    const bag2 = match(parentAst2, parentPattern2);
    expect(bag2).not.toBeNull();
    // bind() captures whole node under "node"
    expect(bag2!.node).toBe(exprAst);
  });
});
