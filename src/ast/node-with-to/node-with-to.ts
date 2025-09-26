import type { ExtractCaptures } from "@/pattern";
import type { AstTransform } from "@/ast/ast-transform";
import type { TSESTree } from "@typescript-eslint/types";
import type { WithoutInternalAstFields } from "@/type-utils";
import type { PatternBuilder } from "@/ast/pattern-builder";
import type { NodeKind } from "@/ast/node-kind";
import type { NodeByKind } from "@/ast/node-by-kind";

/**
 * Add a terminal `.to` method to a node value `N`.
 *
 * `.to` finalizes the pattern by providing a rewrite factory that receives the
 * capture bag derived from the node. The return value is a
 * semantic descriptor and is intentionally not a `Pattern<…>` so it cannot be
 * embedded into other patterns (root-only usage emerges from types).
 */
type RequireKeysSubset<Small, Big> = Exclude<
  keyof Small,
  keyof Big
> extends never
  ? {}
  : never;

export type NodeWithTo<Node> = {
  /**
   * Finalize the node by directly providing a builder for the output kind.
   * Accepts a `PatternBuilder<K>` and uses the concrete node shape for `K` as
   * the output type. Equivalent to `.to((bag) => Builder(bag))`.
   */
  to<K extends NodeKind>(
    builder: PatternBuilder<K> &
      RequireKeysSubset<
        ExtractCaptures<Node>,
        WithoutInternalAstFields<NodeByKind[K]>
      >
  ): AstTransform<Node, WithoutInternalAstFields<NodeByKind[K]>>;

  /**
   * Finalize the node with a rewrite factory.
   *
   * @typeParam Result Arbitrary result type produced by the factory (e.g., a
   * builder-produced node). Consumers may constrain this further.
   * @param factory Callback receiving the capture bag.
   * @returns A semantic descriptor that is not a `Pattern`.
   */
  to<Result extends WithoutInternalAstFields<TSESTree.Node>>(
    factory: (bag: ExtractCaptures<Node>) => Result
  ): AstTransform<Node, Result>;
};
