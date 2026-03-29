import type { ExtractCaptures } from "@/pattern";
import type { SingleValueOf } from "@/type-utils/single-value-of";
import type { HasSingleCapture } from "@/ast/capture-cardinality";
import type { FluentNode } from "@/ast/fluent-node";
import type { SubstituteCaptures } from "@/ast/substitute-captures";
import type { SubstituteSingleCapture } from "@/ast/substitute-single-capture";
import type { NormalizeBag } from "@/ast/normalize-bag";

/**
 * Add a fluent `.map` method to a node value `N`.
 *
 * `.map` transforms the capture bag types used by the node and structurally
 * updates embedded capture/spread occurrences accordingly.
 *
 * Overloads:
 * - Single-capture map — `(value) => New` when there is exactly one capture.
 *   Returns a node where that capture’s value type is replaced with `New`.
 * - Bag map — `(bag) => NewBag` for any number of captures. Returns a node
 *   where all occurrences are updated per `NewBag`.
 */
export type NodeWithMap<Node> = Node & {
  /** Single-capture map overload (exactly one capture). */
  map<NewValue>(
    fn: [HasSingleCapture<Node>] extends [true]
      ? (value: SingleValueOf<ExtractCaptures<Node>>) => NewValue
      : never
  ): [HasSingleCapture<Node>] extends [true]
    ? FluentNode<SubstituteSingleCapture<Node, NewValue>>
    : never;

  /** Bag map overload (any number of captures). */
  map<NewBag>(
    fn: (bag: ExtractCaptures<Node>) => NewBag
  ): FluentNode<SubstituteCaptures<Node, NormalizeBag<NewBag>>>;
};
