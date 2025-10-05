import type { ExtractCaptures } from "@/pattern";
import type { SubstituteCaptures } from "@/ast/substitute-captures";
import type { SingleKeyOf } from "@/type-utils/single-key-of";
import type { FluentNode } from "@/ast/fluent-node";
import type { TSESTree } from "@typescript-eslint/types";

type UnwrapFluent<T> = T extends FluentNode<infer N> ? N : T;
type Rehydrate<T> = T extends { type: infer Tag }
  ? Extract<TSESTree.Node, { type: Tag }>
  : T;
type CollapseCategories<T> = [T] extends [TSESTree.Expression]
  ? TSESTree.Expression
  : [T] extends [TSESTree.Statement]
  ? TSESTree.Statement
  : T;
type NormalizeCaptured<V> = CollapseCategories<Rehydrate<UnwrapFluent<V>>>;

export type NormalizeBag<B> = {
  [K in keyof B]: NormalizeCaptured<B[K]>;
};

/**
 * Convenience alias for substituting exactly one capture's value in `Node`
 * with the normalized type of `Expr`.
 */
export type SubstituteSingleCapture<Node, Expr> = SubstituteCaptures<
  Node,
  {
    [K in SingleKeyOf<ExtractCaptures<Node>> &
      keyof ExtractCaptures<Node>]: NormalizeCaptured<Expr>;
  }
>;
