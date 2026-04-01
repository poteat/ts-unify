import { extractPatterns } from "./extract-patterns";
import { NODE } from "@/ast/builder-map/builder-map";
import type { ProxyNode } from "@/ast/builder-map";

/** Helper: create a minimal proxy-shaped function carrying a NODE descriptor. */
function makeProxy(node: ProxyNode): unknown {
  const fn = function () {};
  (fn as any)[NODE] = node;
  return fn;
}

describe("extractPatterns", () => {
  it("returns an empty array for non-proxy values", () => {
    expect(extractPatterns(42)).toEqual([]);
    expect(extractPatterns({})).toEqual([]);
  });

  it("extracts a single-node pattern", () => {
    const proxy = makeProxy({
      tag: "Identifier",
      args: [{ name: "foo" }],
      chain: [],
    });

    const result = extractPatterns(proxy);
    expect(result).toHaveLength(1);
    expect(result[0].tag).toBe("Identifier");
    expect(result[0].pattern).toEqual({ name: "foo" });
  });

  it("extracts patterns from an or() disjunction", () => {
    const branch1 = makeProxy({
      tag: "ReturnStatement",
      args: [{ argument: "cap" }],
      chain: [],
    });
    const branch2 = makeProxy({
      tag: "ThrowStatement",
      args: [{ argument: "cap2" }],
      chain: [],
    });

    const orProxy = makeProxy({
      tag: "or",
      args: [branch1, branch2],
      chain: [],
    });

    const result = extractPatterns(orProxy);
    expect(result).toHaveLength(2);
    expect(result[0].tag).toBe("ReturnStatement");
    expect(result[1].tag).toBe("ThrowStatement");
  });

  it("extracts patterns from fromNode with string type", () => {
    const proxy = makeProxy({
      tag: "fromNode",
      args: [{ type: "IfStatement", test: "cap" }],
      chain: [],
    });

    const result = extractPatterns(proxy);
    expect(result).toHaveLength(1);
    expect(result[0].tag).toBe("IfStatement");
    expect(result[0].pattern).toEqual({ test: "cap" });
    // type field should be stripped from pattern
    expect(result[0].pattern).not.toHaveProperty("type");
  });

  it("returns empty array when tag is missing", () => {
    const fn = function () {};
    (fn as any)[NODE] = { tag: "", args: [], chain: [] };
    expect(extractPatterns(fn)).toEqual([]);
  });

  it("preserves chain entries", () => {
    const chain = [{ method: "when", args: [() => true] }];
    const proxy = makeProxy({
      tag: "Identifier",
      args: [{ name: "x" }],
      chain,
    });

    const result = extractPatterns(proxy);
    expect(result[0].chain).toBe(chain);
  });
});
