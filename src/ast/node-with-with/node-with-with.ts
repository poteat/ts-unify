import type { ExtractCaptures } from "@/pattern";
import type { FluentNode } from "@/ast/fluent-node";
import type { NormalizeBag } from "@/ast/normalize-bag";
import type { SubstituteCaptures } from "@/ast/substitute-captures";

type Overwrite<Left, Right> = Omit<Left, keyof Right> & Right;

/**
 * Add a fluent `.with` that merges a new bag into the existing capture bag:
 * - Overwrites colliding keys with the new bag's entry type
 * - Adds new keys (carried via brand so downstream `.to` sees them)
 */
export type NodeWithWith<Node> = Node & {
  with<NewBag>(
    fn: (bag: ExtractCaptures<Node>) => NewBag
  ): FluentNode<
    SubstituteCaptures<
      Node,
      Overwrite<ExtractCaptures<Node>, NormalizeBag<NewBag>>
    > & { readonly __with: Overwrite<
      ExtractCaptures<Node>,
      NormalizeBag<NewBag>
    > }
  >;
};
