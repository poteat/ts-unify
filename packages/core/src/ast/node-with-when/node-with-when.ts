import type { HasSingleCapture } from '@/ast/capture-cardinality'
import type { FluentNode } from '@/ast/fluent-node'
import type { SubstituteCaptures } from '@/ast/substitute-captures'
import type { SubstituteSingleCapture } from '@/ast/substitute-single-capture'
import type { ExtractCaptures } from '@/pattern'
import type { SingleValueOf } from '@/type-utils/single-value-of'

/**
 * Add a fluent `.when` method to a node value `N`.
 * The capture bag is derived from the node shape as `ExtractCaptures<N>`.
 *
 * Overloads:
 * - Single-capture sugar — if the bag has exactly one key, accept
 *   `(value) => value is Narrow` to refine that capture and return a narrowed
 *   node.
 * - Single-capture predicate — `(value) => boolean` returns the same node type
 *   (no narrowing).
 * - Bag guard — `(bag): bag is Narrow` refines the node by structurally
 *   updating capture/spread occurrences.
 * - Bag predicate — `(bag) => boolean` returns the same node type.
 *
 * The bag forms are open to a single-capture node too, with an annotated
 * parameter: the match passes the bag at runtime whatever the capture count.
 */
export type NodeWithWhen<Node> = Node & {
  /**
   * Single-capture type guard overload. When the node has exactly one capture,
   * accepts a value-guard that narrows that capture's value type and
   * structurally updates the embedded capture tokens in the node.
   *
   * @typeParam VNarrow The narrowed value type for the single capture.
   * @param guard Predicate that refines the single capture's value. A false
   * result excludes the node from matching.
   * @returns A node with the capture and its occurrences narrowed.
   */
  readonly when: (<VNarrow extends SingleValueOf<ExtractCaptures<Node>>>(
    guard: [HasSingleCapture<Node>] extends [true]
      ? (value: SingleValueOf<ExtractCaptures<Node>>) => value is VNarrow
      : never,
  ) => [HasSingleCapture<Node>] extends [true]
    ? FluentNode<SubstituteSingleCapture<Node, VNarrow>>
    : never) &
    ((
      predicate: [HasSingleCapture<Node>] extends [true]
        ? (value: SingleValueOf<ExtractCaptures<Node>>) => boolean
        : never,
    ) => [HasSingleCapture<Node>] extends [true] ? FluentNode<Node> : never) &
    (<Narrow extends ExtractCaptures<Node>>(
      guard: (bag: ExtractCaptures<Node>) => bag is Narrow,
    ) => FluentNode<SubstituteCaptures<Node, Narrow>>) &
    ((predicate: (bag: ExtractCaptures<Node>) => boolean) => FluentNode<Node>)
}
