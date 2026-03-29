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

function makeProxy(): any {
  const handler: ProxyHandler<any> = {
    get(_, prop) {
      if (typeof prop === "symbol") return undefined;
      return makeProxy();
    },
    apply(_, __, _args) {
      return makeProxy();
    },
  };
  return new Proxy(function () {}, handler);
}

/** AST pattern builder namespace. */
export const U = makeProxy() as BuilderMap;
