import type { FluentNode } from "@/ast/fluent-node";
import type { UnwrapFluent } from "@/ast/unwrap-fluent";

/**
 * Variadic disjunction over fluent nodes. Returns a union of the branch fluent
 * nodes to preserve per-branch keys for downstream binding/extraction.
 */
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
