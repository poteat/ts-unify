import { extractPatterns } from "./extract-patterns";
import { U } from "@ts-unify/core";
import { NODE } from "@ts-unify/core/internal";
import type { ProxyNode } from "@ts-unify/core/internal";

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

  it("keeps one entry per branch when branches share a tag", () => {
    const or = (U as any).or(
      (U as any).VariableDeclaration({ kind: "let" }),
      (U as any).VariableDeclaration({ kind: "var" }),
    );
    const result = extractPatterns(or);
    expect(result.map((e) => e.tag)).toEqual(["VariableDeclaration", "VariableDeclaration"]);
    expect(result.map((e) => e.pattern.kind)).toEqual(["let", "var"]);
  });

  it("appends a root or's .when(), .where() and .config() to each branch chain", () => {
    const guard = () => true;
    const branchGuard = () => true;
    const or = (U as any)
      .or((U as any).Identifier().when(branchGuard), (U as any).Literal())
      .when(guard)
      .message("m");
    const result = extractPatterns(or);
    expect(result[0].chain.map((c) => c.method)).toEqual(["when", "when"]);
    expect(result[0].chain[0].args[0]).toBe(branchGuard);
    expect(result[0].chain[1].args[0]).toBe(guard);
    expect(result[1].chain.map((c) => c.method)).toEqual(["when"]);
  });
});
