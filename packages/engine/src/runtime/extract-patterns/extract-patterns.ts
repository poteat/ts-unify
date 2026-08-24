import { NODE } from "@ts-unify/core/internal";
import type { ProxyNode, ChainEntry } from "@ts-unify/core/internal";
import { symGet } from "../sym-get";

/** Chain methods on a root `U.or` that every branch inherits. */
const ROOT_INHERITED = new Set(["when", "where", "config"]);

/**
 * Extract all entry patterns from a rule's proxy trace.
 * Handles top-level `U.or(...)` and `U.fromNode(...)` as well as plain
 * single-node patterns. Two branches of a root `U.or` with the same tag
 * yield two entries; consumers merge them per tag.
 */
export function extractPatterns(rule: unknown): {
  tag: string;
  pattern: Record<string, unknown>;
  chain: ChainEntry[];
}[] {
  const proxyNode = symGet(rule, NODE) as ProxyNode | undefined;
  if (!proxyNode?.tag) return [];
  if (proxyNode.tag === "or") {
    // Root guards and config apply to whichever branch matched, so each
    // branch chain is extended with them, after the branch's own entries.
    const rootGuards = proxyNode.chain.filter((c) => ROOT_INHERITED.has(c.method));
    return proxyNode.args.flatMap((arg: unknown) => {
      if (typeof arg === "function" && symGet(arg, NODE)) {
        const inner = symGet(arg, NODE) as ProxyNode;
        return [
          {
            tag: inner.tag,
            pattern: (inner.args[0] ?? {}) as Record<string, unknown>,
            chain: [...inner.chain, ...rootGuards],
          },
        ];
      }
      return [];
    });
  }
  if (proxyNode.tag === "fromNode") {
    const pattern = (proxyNode.args[0] ?? {}) as Record<string, unknown>;
    const typeField = pattern.type;
    if (typeof typeField === "function" && symGet(typeField, NODE)) {
      const typeNode = symGet(typeField, NODE) as ProxyNode;
      if (typeNode.tag === "or") {
        const { type: _type, ...rest } = pattern;
        return typeNode.args.map((t: unknown) => ({ tag: t as string, pattern: rest, chain: proxyNode.chain }));
      }
    }
    if (typeof typeField === "string") {
      const { type: _type, ...rest } = pattern;
      return [{ tag: typeField, pattern: rest, chain: proxyNode.chain }];
    }
    return [];
  }
  return [{ tag: proxyNode.tag, pattern: (proxyNode.args[0] ?? {}) as Record<string, unknown>, chain: proxyNode.chain }];
}

/** Extract the first entry pattern from a rule's proxy trace. */
function extractPattern(rule: unknown): {
  tag: string;
  pattern: Record<string, unknown>;
} | null {
  const patterns = extractPatterns(rule);
  return patterns[0] ?? null;
}

// Re-export extractPattern for internal use by sibling modules (not part of
// the public API surface).
export { extractPattern as _extractPattern };
