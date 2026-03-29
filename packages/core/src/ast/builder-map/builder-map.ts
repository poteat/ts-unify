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

export const TRACE = Symbol.for("ts-unify.trace");

type TraceStep = { type: "get"; key: string } | { type: "apply"; args: any[] };

function makeProxy(trace: TraceStep[] = []): any {
  const handler: ProxyHandler<any> = {
    get(_, prop) {
      if (prop === TRACE) return trace;
      if (typeof prop === "symbol") return undefined;
      return makeProxy([...trace, { type: "get", key: prop as string }]);
    },
    apply(_, __, args) {
      return makeProxy([...trace, { type: "apply", args }]);
    },
  };
  return new Proxy(function () {}, handler);
}

/** AST pattern builder namespace. */
export const U = makeProxy() as BuilderMap;
