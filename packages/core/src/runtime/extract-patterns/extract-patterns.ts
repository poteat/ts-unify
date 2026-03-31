import { NODE } from "@/ast/builder-map";
import type { ProxyNode } from "@/ast/builder-map";

/**
 * Extract all entry patterns from a rule's proxy trace.
 * Handles top-level `U.or(...)` and `U.fromNode(...)` as well as plain
 * single-node patterns.
 */
export function extractPatterns(rule: any): {
  tag: string;
  pattern: any;
}[] {
  const proxyNode: ProxyNode | undefined = rule[NODE];
  if (!proxyNode?.tag) return [];
  if (proxyNode.tag === "or") {
    return proxyNode.args.flatMap((arg: any) => {
      if (typeof arg === "function" && arg[NODE]) {
        const inner: ProxyNode = arg[NODE];
        return [{ tag: inner.tag, pattern: inner.args[0] ?? {} }];
      }
      return [];
    });
  }
  if (proxyNode.tag === "fromNode") {
    const pattern = proxyNode.args[0] ?? {};
    const typeField = pattern.type;
    if (typeof typeField === "function" && typeField[NODE]) {
      const typeNode: ProxyNode = typeField[NODE];
      if (typeNode.tag === "or") {
        const { type: _type, ...rest } = pattern;
        return typeNode.args.map((t: string) => ({ tag: t, pattern: rest }));
      }
    }
    if (typeof typeField === "string") {
      const { type: _type, ...rest } = pattern;
      return [{ tag: typeField, pattern: rest }];
    }
    return [];
  }
  return [{ tag: proxyNode.tag, pattern: proxyNode.args[0] ?? {} }];
}

/** Extract the first entry pattern from a rule's proxy trace. */
function extractPattern(rule: any): {
  tag: string;
  pattern: any;
} | null {
  const patterns = extractPatterns(rule);
  return patterns[0] ?? null;
}

// Re-export extractPattern for internal use by sibling modules (not part of
// the public API surface).
export { extractPattern as _extractPattern };
