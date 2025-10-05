import type { SingleKeyOf } from "@/type-utils/single-key-of";
import type { ExtractCaptures } from "@/pattern";
import type { FluentNode } from "@/ast/fluent-node";
import type { SubstituteCaptures } from "@/ast/substitute-captures";
import type { SubstituteSingleCapture } from "@/ast/substitute-single-capture";

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
  when<VNarrow extends SingleValueOf<ExtractCaptures<Node>>>(
    guard: [SingleKeyOf<ExtractCaptures<Node>>] extends [never]
      ? never
      : (value: SingleValueOf<ExtractCaptures<Node>>) => value is VNarrow
  ): [SingleKeyOf<ExtractCaptures<Node>>] extends [never]
    ? never
    : FluentNode<SubstituteSingleCapture<Node, VNarrow>>;

  /**
   * Single-capture boolean predicate overload. When the node has exactly one
   * capture, accepts a value predicate without changing types.
   *
   * @param predicate Predicate over the single capture's value. A false result
   * excludes the node from matching.
   * @returns The same node type (no narrowing).
   */
  when(
    predicate: [SingleKeyOf<ExtractCaptures<Node>>] extends [never]
      ? never
      : (value: SingleValueOf<ExtractCaptures<Node>>) => boolean
  ): FluentNode<Node>;

  /**
   * Bag type guard overload. Accepts a guard over the capture bag derived from
   * the node, and refines all matching capture/spread occurrences in the node.
   *
   * @typeParam Narrow The refined capture bag type.
   * @param guard Predicate that refines the capture bag. A false result
   * excludes the node from matching.
   * @returns A node with all occurrences narrowed per the refined bag.
   */
  when<Narrow extends ExtractCaptures<Node>>(
    guard: [SingleKeyOf<ExtractCaptures<Node>>] extends [never]
      ? (bag: ExtractCaptures<Node>) => bag is Narrow
      : never
  ): [SingleKeyOf<ExtractCaptures<Node>>] extends [never]
    ? FluentNode<SubstituteCaptures<Node, Narrow>>
    : never;

  /**
   * Bag boolean predicate overload. Accepts a predicate over the capture bag
   * without changing types.
   *
   * @param predicate Predicate over the capture bag. A false result excludes
   * the node from matching.
   * @returns The same node type (no narrowing).
   */
  when(
    predicate: [SingleKeyOf<ExtractCaptures<Node>>] extends [never]
      ? (bag: ExtractCaptures<Node>) => boolean
      : never
  ): [SingleKeyOf<ExtractCaptures<Node>>] extends [never]
    ? FluentNode<Node>
    : never;
};

// Helper types for single-capture ergonomics
type SingleValueOf<T> = SingleKeyOf<T> extends infer K ? T[K & keyof T] : never;
