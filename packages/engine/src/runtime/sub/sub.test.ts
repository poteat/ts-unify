import { sub, contains } from "./sub";

describe("sub", () => {
  it("replaces a structurally equal node", () => {
    const tree = {
      type: "CallExpression",
      callee: { type: "Identifier", name: "handler" },
      arguments: [{ type: "Identifier", name: "err" }],
    };
    const target = { type: "Identifier", name: "handler" };
    const replacement = {
      type: "MemberExpression",
      object: { type: "Identifier", name: "config" },
      property: { type: "Identifier", name: "onError" },
    };

    const result = sub(tree, target, replacement) as Record<string, unknown>;
    expect(result.callee).toEqual(replacement);
    // "err" identifier is untouched
    expect((result.arguments as unknown[])[0]).toEqual({
      type: "Identifier",
      name: "err",
    });
  });

  it("replaces multiple occurrences", () => {
    const tree = {
      type: "BinaryExpression",
      left: { type: "Identifier", name: "x" },
      right: { type: "Identifier", name: "x" },
    };
    const result = sub(
      tree,
      { type: "Identifier", name: "x" },
      { type: "Literal", value: 1 }
    ) as Record<string, unknown>;
    expect(result.left).toEqual({ type: "Literal", value: 1 });
    expect(result.right).toEqual({ type: "Literal", value: 1 });
  });

  it("does not replace non-matching nodes", () => {
    const tree = {
      type: "Identifier",
      name: "y",
    };
    const result = sub(
      tree,
      { type: "Identifier", name: "x" },
      { type: "Literal", value: 1 }
    );
    expect(result).toEqual({ type: "Identifier", name: "y" });
  });

  it("handles arrays", () => {
    const tree = [
      { type: "Identifier", name: "x" },
      { type: "Identifier", name: "y" },
    ];
    const result = sub(
      tree,
      { type: "Identifier", name: "x" },
      { type: "Literal", value: 42 }
    );
    expect(result).toEqual([
      { type: "Literal", value: 42 },
      { type: "Identifier", name: "y" },
    ]);
  });

  it("returns primitives as-is", () => {
    expect(sub(42, { type: "X" }, { type: "Y" })).toBe(42);
    expect(sub("hello", { type: "X" }, { type: "Y" })).toBe("hello");
    expect(sub(null, { type: "X" }, { type: "Y" })).toBeNull();
  });

  it("does not mutate the original tree", () => {
    const tree = {
      type: "ReturnStatement",
      argument: { type: "Identifier", name: "x" },
    };
    const original = JSON.stringify(tree);
    sub(tree, { type: "Identifier", name: "x" }, { type: "Literal", value: 1 });
    expect(JSON.stringify(tree)).toBe(original);
  });

  it("ignores parent/loc/range during comparison", () => {
    const tree = {
      type: "Identifier",
      name: "x",
      loc: { start: { line: 1 }, end: { line: 1 } },
      range: [0, 1],
    };
    const result = sub(
      tree,
      { type: "Identifier", name: "x" },
      { type: "Literal", value: 1 }
    );
    expect(result).toEqual({ type: "Literal", value: 1 });
  });

  it("replaces the root itself if it matches", () => {
    const result = sub(
      { type: "Identifier", name: "x" },
      { type: "Identifier", name: "x" },
      { type: "Literal", value: 99 }
    );
    expect(result).toEqual({ type: "Literal", value: 99 });
  });
});

describe("contains", () => {
  it("finds a node in a nested tree", () => {
    const tree = {
      type: "ReturnStatement",
      argument: { type: "Identifier", name: "x" },
    };
    expect(contains(tree, { type: "Identifier", name: "x" })).toBe(true);
  });

  it("returns false when not found", () => {
    const tree = {
      type: "ReturnStatement",
      argument: { type: "Identifier", name: "y" },
    };
    expect(contains(tree, { type: "Identifier", name: "x" })).toBe(false);
  });

  it("matches the root itself", () => {
    expect(contains({ type: "Identifier", name: "x" }, { type: "Identifier", name: "x" })).toBe(true);
  });

  it("searches arrays", () => {
    const tree = [
      { type: "Literal", value: 1 },
      { type: "Identifier", name: "x" },
    ];
    expect(contains(tree, { type: "Identifier", name: "x" })).toBe(true);
  });

  it("ignores loc/range during comparison", () => {
    const tree = {
      type: "Identifier",
      name: "x",
      loc: { start: { line: 1 } },
      range: [0, 1],
    };
    expect(contains(tree, { type: "Identifier", name: "x" })).toBe(true);
  });

  it("returns false for primitives", () => {
    expect(contains(42, { type: "X" })).toBe(false);
    expect(contains(null, { type: "X" })).toBe(false);
  });
});
