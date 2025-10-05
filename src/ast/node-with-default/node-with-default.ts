import type { ExtractCaptures } from "@/pattern";
import type { SingleKeyOf } from "@/type-utils/single-key-of";
import type { FluentNode } from "@/ast/fluent-node";
import type { SubstituteSingleCapture } from "@/ast/substitute-single-capture";

export type NodeWithDefault<Node> = Node & {
  /**
   * Single-capture overload — available only when there is exactly one capture.
   * Equivalent to `.map(v => v ?? expr)`.
   */
  default<Expr>(
    expr: [SingleKeyOf<ExtractCaptures<Node>>] extends [never] ? never : Expr
  ): [SingleKeyOf<ExtractCaptures<Node>>] extends [never]
    ? never
    : FluentNode<SubstituteSingleCapture<Node, Expr>>;

  /** Fallback overload — unusable when there isn't exactly one capture. */
  default(expr: never): never;
};
