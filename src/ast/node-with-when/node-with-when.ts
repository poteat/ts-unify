import type { Capture } from "@/capture/capture-type";
import type { Spread } from "@/capture/spread/spread";
import type { KeysToTuple } from "@/type-utils/keys-to-tuple";
import type { ExtractCaptures } from "@/pattern";
import type { FluentNode } from "@/ast/fluent-node";

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
    : FluentNode<
        ApplyCaptureBagToNode<
          Node,
          BagFromSingle<ExtractCaptures<Node>, VNarrow>
        >
      >;

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
    guard: (bag: ExtractCaptures<Node>) => bag is Narrow
  ): FluentNode<ApplyCaptureBagToNode<Node, Narrow>>;

  /**
   * Bag boolean predicate overload. Accepts a predicate over the capture bag
   * without changing types.
   *
   * @param predicate Predicate over the capture bag. A false result excludes
   * the node from matching.
   * @returns The same node type (no narrowing).
   */
  when(predicate: (bag: ExtractCaptures<Node>) => boolean): FluentNode<Node>;
};

// Helper types for single-capture ergonomics
type SingleKeyOf<T> = KeysToTuple<T> extends readonly [infer K]
  ? K & keyof T
  : never;
type SingleValueOf<T> = SingleKeyOf<T> extends infer K ? T[K & keyof T] : never;
type BagFromSingle<T, V> = SingleKeyOf<T> extends infer K
  ? { [P in K & keyof T]: V }
  : never;
// Inlined ExtractCaptures in signatures; alias removed for clarity.

/**
 * Apply a narrowed capture bag `B` to the node shape `N` by structurally
 * refining embedded capture/spread tokens.
 *
 * - Capture<'name', _> → Capture<'name', B['name']> (if present in B)
 * - Spread<'name', Elem> → Spread<'name', ElemN> when B['name'] is
 *   ReadonlyArray<ElemN>
 * - Recurse through tuples, arrays, and objects.
 */
type ApplyCaptureBagToNode<Node, CaptureBag> =
  // Refine explicit captures by name
  Node extends Capture<infer Name, infer _V>
    ? Name extends keyof CaptureBag
      ? Capture<Name & string, CaptureBag[Name]>
      : Node
    : // Refine spread captures when bag provides a readonly array type
    Node extends Spread<infer SName, infer Elem>
    ? SName extends keyof CaptureBag
      ? CaptureBag[SName] extends ReadonlyArray<infer ElemN>
        ? Spread<SName & string, ElemN>
        : Node
      : Spread<SName & string, Elem>
    : // Tuples
    Node extends readonly [...infer Items]
    ? Readonly<{
        [I in keyof Items]: ApplyCaptureBagToNode<Items[I], CaptureBag>;
      }>
    : // Arrays
    Node extends ReadonlyArray<infer Elem2>
    ? ReadonlyArray<ApplyCaptureBagToNode<Elem2, CaptureBag>>
    : // Objects
    Node extends object
    ? { [K in keyof Node]: ApplyCaptureBagToNode<Node[K], CaptureBag> }
    : // Primitives
      Node;
