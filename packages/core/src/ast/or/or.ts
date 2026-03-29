import type { FluentNode } from "@/ast/fluent-node";
import type { UnwrapFluent } from "@/ast/unwrap-fluent";

/**
 * Variadic disjunction over fluent nodes. Returns a union of the branch fluent
 * nodes to preserve per-branch keys for downstream binding/extraction.
 */
type PrimitiveLiteral =
  | string
  | number
  | boolean
  | bigint
  | symbol
  | null
  | undefined;

export type OrCombinator = {
  /** Literals-only overload: returns a plain union of the underlying values. */
  <V1 extends PrimitiveLiteral, Rest extends readonly PrimitiveLiteral[]>(
    first: V1,
    ...rest: Rest
  ): V1 | Rest[number];

  /** Fluent-first or mixed overload: returns a fluent node union. */
  <B1 extends FluentNode<any>, Rest extends readonly FluentNode<any>[]>(
    first: B1,
    ...rest: Rest
  ): FluentNode<UnwrapFluent<B1> | UnwrapFluent<Rest[number]>> & {
    readonly [OR_BRAND]: true;
  };
};

export declare const OR_BRAND: unique symbol;
