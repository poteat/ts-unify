import type { Pattern } from "@/pattern";
import type { BindCaptures } from "@/capture";
import type { Prettify } from "@/type-utils";
import type { NodeByKind } from "@/ast/node-by-kind";
import type { NodeKind } from "@/ast/node-kind";
import type { NodeWithWhen } from "@/ast/node-with-when";

type InternalKeys = "type" | "parent" | "loc" | "range";

/**
 * Factory type for building patterns for a node kind `K`.
 *
 * - Nullary form: returns just the discriminant `{ type: … }`, representing
 *   "any K" without recursing into fields.
 * - Parameterized form: accepts a `Pattern<NodeByKind[K]>` and returns the
 *   discriminant plus capture bindings projected via `BindCaptures`.
 */
export type PatternBuilder<K extends NodeKind> = {
  (): NodeWithWhen<{ type: NodeByKind[K]["type"] }>;
  <P extends Pattern<NodeByKind[K]>>(pattern: P): NodeWithWhen<
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
  Omit<NodeByKind[K], InternalKeys>
>;
