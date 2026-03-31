import { NODE } from "@/ast/builder-map";
import type { ProxyNode } from "@/ast/builder-map";
import { symGet } from "@/runtime/sym-get";

/**
 * Convert a proxy tree (or real AST node) into a plain ESTree object
 * suitable for recast's `print()`.
 */
export function reify(value: unknown, sourceCode?: unknown): unknown {
  // Proxy node -- convert tag + args into ESTree
  if (typeof value === "function" && symGet(value, NODE)) {
    const node = symGet(value, NODE) as ProxyNode;
    const args = (node.args[0] ?? {}) as Record<string, unknown>;
    const result: Record<string, unknown> = { type: node.tag };
    for (const [k, v] of Object.entries(args)) {
      // The `type` is always determined by the tag, never by the bag
      if (k === "type") continue;
      result[k] = reify(v, sourceCode);
    }
    return result;
  }

  // Arrays
  if (Array.isArray(value)) {
    return value.map((v: unknown) => reify(v, sourceCode));
  }

  // Primitives and plain values
  return value;
}
