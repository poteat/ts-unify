import type { BindCaptures } from "@/capture";
import type { NodeByKind } from "@/ast/node-by-kind";
import type { NodeKind } from "@/ast/node-kind";
import type { FluentNode } from "@/ast/fluent-node";
import type { WithoutInternalAstFields } from "@/type-utils";
// import { AST_NODE_TYPES } from "@typescript-eslint/types";

type OmitDistributive<T, K extends keyof any> = T extends any
  ? Omit<T, K>
  : never;

/**
 * U.fromNode
 *
 * Create a fluent node from a discriminated AST object with a `type` field.
 * Mirrors `PatternBuilder` behavior 1:1, but anchors the kind via the input's
 * `type` discriminant rather than the function name.
 *
 * Ways to call (for kind `K`):
 * - `({ type })` — “any K”: returns the `{ type: … }` tag with fluent helpers.
 * - `({ type, ...shape })` — build a concrete `K` node (no capture tokens).
 * - `({ type, ...pattern })` — define a matchable `K` pattern (supports $).
 */
// Invert the NodeKind→type mapping to recover the kind from a `type` value
type KindForType<V> = {
  [K in NodeKind]: NodeByKind[K]["type"] extends V ? K : never;
}[NodeKind];

export type FromNode = {
  /** "Any K" form: `{ type }` only. */
  <V extends NodeByKind[NodeKind]["type"], K extends KindForType<V>>(input: {
    type: V;
  }): FluentNode<{ type: NodeByKind[K]["type"] }>;

  /** Build a concrete node (no capture tokens). Returns a fluent node. */
  <
    V extends NodeByKind[NodeKind]["type"],
    K extends KindForType<V>,
    S extends OmitDistributive<WithoutInternalAstFields<NodeByKind[K]>, "type">
  >(
    input: { type: V } & S
  ): FluentNode<NodeByKind[K]>;

  /** Match a pattern (supports `$`). Returns fluent node. */
  <P extends { type: NodeByKind[NodeKind]["type"] }>(input: P): FluentNode<
    // Distribute by the provided discriminant and bind per concrete kind.
    (P["type"] extends infer V
      ? V extends NodeByKind[NodeKind]["type"]
        ? BindCaptures<
            // Specialize this pattern to the branch's discriminant
            ({ type: V } & (P extends object ? Omit<P, "type"> : P)),
            WithoutInternalAstFields<NodeByKind[KindForType<V>]>
          >
        : never
      : never)
  >;
};
