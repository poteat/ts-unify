import { NODE } from "@/ast/builder-map";
import type { ProxyNode } from "@/ast/builder-map";

/**
 * Convert a proxy tree (or real AST node) into a plain ESTree object
 * suitable for recast's `print()`.
 */
export function reify(value: any, sourceCode?: any): any {
  // Proxy node -- convert tag + args into ESTree
  if (typeof value === "function" && value[NODE]) {
    const node: ProxyNode = value[NODE];
    const args = node.args[0] ?? {};
    const result: any = { type: node.tag };
    for (const [k, v] of Object.entries(args)) {
      // The `type` is always determined by the tag, never by the bag
      if (k === "type") continue;
      result[k] = reify(v, sourceCode);
    }
    return result;
  }

  // Arrays
  if (Array.isArray(value)) {
    return value.map((v: any) => reify(v, sourceCode));
  }

  // Primitives and plain values
  return value;
}
