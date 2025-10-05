import type { ExtractCaptures } from "@/pattern";
import type { SingleKeyOf } from "@/type-utils/single-key-of";
import type { FluentNode } from "@/ast/fluent-node";
import type { SubstituteCaptures } from "@/ast/substitute-captures";
import type { TSESTree } from "@typescript-eslint/types";

export type NodeWithDefault<Node> = Node & {
  /**
   * Single-capture overload — available only when there is exactly one capture.
   * Equivalent to `.map(v => v ?? expr)`.
   */
  default<Expr>(
    expr: [SingleKeyOf<ExtractCaptures<Node>>] extends [never]
      ? never
      : Expr
  ): [SingleKeyOf<ExtractCaptures<Node>>] extends [never]
    ? never
    : FluentNode<
        SubstituteCaptures<
          Node,
          BagFromSingle<ExtractCaptures<Node>, NormalizeCaptured<Expr>>
        >
      >;

  /** Fallback overload — unusable when there isn't exactly one capture. */
  default(expr: never): never;
};

type SingleValueOf<T> = SingleKeyOf<T> extends infer K ? T[K & keyof T] : never;
type BagFromSingle<T, V> = SingleKeyOf<T> extends infer K
  ? { [P in K & keyof T]: V }
  : never;

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
