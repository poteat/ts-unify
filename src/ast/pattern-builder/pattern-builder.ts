import type { Pattern } from "@/pattern";
import type { BindCaptures } from "@/capture";
import type { Prettify } from "@/type-utils";
import type { NodeByKind } from "@/ast/node-by-kind";
import type { NodeKind } from "@/ast/node-kind";
import type { FluentNode } from "@/ast/fluent-node";
import type { WithoutInternalAstFields } from "@/type-utils";

/**
 * Create builders for AST kind `K`.
 *
 * Ways to call:
 * - `()` — “any K”: returns the `{ type: … }` tag with fluent match helpers.
 * - `(shape)` — build a concrete `K` node (no capture tokens) for outputs.
 * - `(pattern)` — define a matchable `K` pattern (supports $).
 *
 * Examples
 * - `U.BlockStatement()` → match any block
 * - `U.ConditionalExpression({ test, consequent, alternate })` → build node
 * - `U.ReturnStatement({ argument: $("arg") })` → pattern with a capture
 */
export type PatternBuilder<K extends NodeKind> = {
  /** Match any `K`. Returns `{ type: … }` with fluent helpers. */
  (): FluentNode<{ type: NodeByKind[K]["type"] }>;

  /** Build a concrete `K` node (no capture tokens). Returns a fluent node. */
  <S extends WithoutInternalAstFields<NodeByKind[K]>>(shape: S): FluentNode<
    Prettify<{ type: NodeByKind[K]["type"] } & S>
  >;

  /** Match a `K` pattern (supports `$`). Returns fluent node. */
  <P extends Pattern<NodeByKind[K]>>(pattern: P): FluentNode<
    Prettify<{ type: NodeByKind[K]["type"] } & BindAgainstNodeKind<P, K>>
  >;
};

/**
 * Assuming a pattern `P` conforms to the shape of AST node kind `K`, bind
 * the capture bag type from `P` using the specific corresponding types from
 * the AST node shape `NodeByKind[K]`.
 */
type BindAgainstNodeKind<P, K extends NodeKind> = BindCaptures<
  P,
  WithoutInternalAstFields<NodeByKind[K]>
>;
