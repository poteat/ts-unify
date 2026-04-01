import { reify } from "./reify";
import { NODE } from "@ts-unify/core/internal";
import type { ProxyNode } from "@ts-unify/core/internal";

/** Helper: create a minimal proxy-shaped function carrying a NODE descriptor. */
function makeProxy(node: ProxyNode): unknown {
  const fn = function () {};
  (fn as any)[NODE] = node;
  return fn;
}

describe("reify", () => {
  it("converts a proxy node to a plain ESTree object", () => {
    const proxy = makeProxy({
      tag: "Identifier",
      args: [{ name: "x" }],
      chain: [],
    });

    const result = reify(proxy) as Record<string, unknown>;
    expect(result).toEqual({ type: "Identifier", name: "x" });
  });

  it("recursively reifies nested proxy nodes", () => {
    const inner = makeProxy({
      tag: "Identifier",
      args: [{ name: "y" }],
      chain: [],
    });

    const outer = makeProxy({
      tag: "ReturnStatement",
      args: [{ argument: inner }],
      chain: [],
    });

    const result = reify(outer) as Record<string, unknown>;
    expect(result).toEqual({
      type: "ReturnStatement",
      argument: { type: "Identifier", name: "y" },
    });
  });

  it("reifies arrays of proxy nodes", () => {
    const elem = makeProxy({
      tag: "Literal",
      args: [{ value: 42 }],
      chain: [],
    });

    const result = reify([elem, "plain"]);
    expect(result).toEqual([{ type: "Literal", value: 42 }, "plain"]);
  });

  it("passes through primitives unchanged", () => {
    expect(reify(42)).toBe(42);
    expect(reify("hello")).toBe("hello");
    expect(reify(null)).toBeNull();
    expect(reify(undefined)).toBeUndefined();
    expect(reify(true)).toBe(true);
  });

  it("ignores type field from args (uses tag instead)", () => {
    const proxy = makeProxy({
      tag: "Identifier",
      args: [{ type: "ShouldBeIgnored", name: "z" }],
      chain: [],
    });

    const result = reify(proxy) as Record<string, unknown>;
    expect(result.type).toBe("Identifier");
    expect(result.name).toBe("z");
  });

  it("handles a proxy with no args", () => {
    const proxy = makeProxy({
      tag: "EmptyStatement",
      args: [],
      chain: [],
    });

    const result = reify(proxy) as Record<string, unknown>;
    expect(result).toEqual({ type: "EmptyStatement" });
  });
});
