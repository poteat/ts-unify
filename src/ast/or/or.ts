import type { FluentNode } from "@/ast/fluent-node";
import type { NodeWithWhen } from "@/ast/node-with-when";
import type { NodeWithSeal } from "@/ast/node-with-seal";
import type { NodeWithTo } from "@/ast/node-with-to";

/**
 * Variadic disjunction over fluent nodes. Returns a union of the branch fluent
 * nodes to preserve per-branch keys for downstream binding/extraction.
 */
type UnwrapFluent<T> = T extends NodeWithWhen<infer N> &
  NodeWithSeal<infer _N> &
  NodeWithTo<infer __N>
  ? N
  : never;

export type OrCombinator = <
  B1 extends FluentNode<any>,
  Rest extends readonly FluentNode<any>[]
>(
  first: B1,
  ...rest: Rest
) => FluentNode<UnwrapFluent<B1> | UnwrapFluent<Rest[number]>> & {
  readonly [OR_BRAND]: true;
};

export declare const OR_BRAND: unique symbol;
