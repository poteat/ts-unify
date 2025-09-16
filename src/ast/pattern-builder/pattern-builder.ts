import type { Pattern } from "@/pattern";
import type { BindCaptures } from "@/capture";
import type { Prettify } from "@/type-utils";
import type { NodeByKind } from "@/ast/node-by-kind";
import type { NodeKind } from "@/ast/node-kind";

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
  (): { type: NodeByKind[K]["type"] };
  <P extends Pattern<NodeByKind[K]>>(pattern: P): Prettify<
    { type: NodeByKind[K]["type"] } & BindCaptures<
      P,
      Omit<NodeByKind[K], InternalKeys>
    >
  >;
};
