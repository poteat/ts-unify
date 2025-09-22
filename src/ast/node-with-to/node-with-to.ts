import type { ExtractCaptures } from "@/pattern";
import type { AstTransform } from "@/ast/ast-transform";
import type { Node as ConcreteNode } from "@typescript-eslint/types/dist/generated/ast-spec";
import type { WithoutInternalAstFields } from "@/type-utils";

/**
 * Add a terminal `.to` method to a node value `N`.
 *
 * `.to` finalizes the pattern by providing a rewrite factory that receives the
 * capture bag derived from the node. The return value is a
 * semantic descriptor and is intentionally not a `Pattern<…>` so it cannot be
 * embedded into other patterns (root-only usage emerges from types).
 */
export type NodeWithTo<Node> = {
  /**
   * Finalize the node with a rewrite factory.
   *
   * @typeParam Result Arbitrary result type produced by the factory (e.g., a
   * builder-produced node). Consumers may constrain this further.
   * @param factory Callback receiving the capture bag.
   * @returns A semantic descriptor that is not a `Pattern`.
   */
  to<Result extends WithoutInternalAstFields<ConcreteNode>>(
    factory: (bag: ExtractCaptures<Node>) => Result
  ): AstTransform<Node, Result>;
};
