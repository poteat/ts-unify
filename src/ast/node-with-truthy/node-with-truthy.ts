import type { ExtractCaptures } from "@/pattern";
import type { HasSingleCapture } from "@/ast/capture-cardinality";
import type { FluentNode } from "@/ast/fluent-node";
import type { SubstituteSingleCapture } from "@/ast/substitute-single-capture";
import type { Truthy } from "@/ast/builder-helpers";
import type { SingleValueOf } from "@/type-utils/single-value-of";

/**
 * Add a fluent `.truthy()` method to a node value `N`.
 *
 * `.truthy()` is a single-capture sugar equivalent to `.when(U.truthy)`:
 * it narrows the single capture's value type by excluding JS-falsy values
 * (`false | 0 | 0n | "" | null | undefined`).
 */
export type NodeWithTruthy<Node> = Node & {
  truthy(
    ..._enforce: [HasSingleCapture<Node>] extends [true] ? [] : [never]
  ): FluentNode<
    SubstituteSingleCapture<Node, Truthy<SingleValueOf<ExtractCaptures<Node>>>>
  >;
};
