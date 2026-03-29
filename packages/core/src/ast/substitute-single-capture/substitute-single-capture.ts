import type { ExtractCaptures } from "@/pattern";
import type { SubstituteCaptures } from "@/ast/substitute-captures";
import type { SingleKeyOf } from "@/type-utils/single-key-of";
import type { NormalizeCaptured } from "@/ast/normalize-captured";

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
