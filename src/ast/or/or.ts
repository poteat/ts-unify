import type { FluentNode } from "@/ast/fluent-node";

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
) => (B1 | Rest[number]) & { readonly [OR_BRAND]: true };

export declare const OR_BRAND: unique symbol;
