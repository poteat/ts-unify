import type { NodeKind, PatternBuilder } from "@/ast";
import type { BuilderUtilities } from "@/ast/builder-utilities";

/**
 * Map from `NodeKind` to its corresponding `PatternBuilder`.
 *
 * This represents the public surface of the builder registry (e.g., `U`).
 */
export type BuilderMap = {
  [K in NodeKind]: PatternBuilder<K>;
} & BuilderUtilities;

export const NODE = Symbol.for("ts-unify.node");

export type ChainEntry = { method: string; args: unknown[] };

export type ProxyNode = {
  tag: string;
  args: unknown[];
  chain: ChainEntry[];
};

// The proxy is inherently untyped: it intercepts arbitrary property access and
// function calls to build up a ProxyNode descriptor at runtime.  TypeScript's
// Proxy typing cannot express this dynamic shape, so `any` on the return type
// and spread args is unavoidable.  The cast to `BuilderMap` at the export site
// restores type safety for callers.
function makeProxy(node?: ProxyNode): any {
  return new Proxy(function () {}, {
    get(_, prop) {
      if (prop === NODE) return node;
      if (typeof prop === "symbol") return undefined;
      if (node) {
        // Fluent method on an existing node — return callable that appends to chain
        const method = prop as string;
        return (...args: unknown[]) =>
          makeProxy({ ...node, chain: [...node.chain, { method, args }] });
      }
      // Builder access on root — return callable that creates a node
      const tag = prop as string;
      return (...args: unknown[]) => makeProxy({ tag, args, chain: [] });
    },
    apply(_, __, args) {
      return makeProxy({ tag: "", args, chain: [] });
    },
  });
}

/** AST pattern builder namespace. */
export const U = makeProxy() as BuilderMap;
