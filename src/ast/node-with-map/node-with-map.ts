import type { Capture } from "@/capture/capture-type";
import type { Spread } from "@/capture/spread/spread";
import type { ExtractCaptures } from "@/pattern";
import type { SingleKeyOf } from "@/type-utils/single-key-of";
import type { FluentNode } from "@/ast/fluent-node";
import type { TSESTree } from "@typescript-eslint/types";

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
    fn: [SingleKeyOf<ExtractCaptures<Node>>] extends [never]
      ? never
      : (value: SingleValueOf<ExtractCaptures<Node>>) => NewValue
  ): [SingleKeyOf<ExtractCaptures<Node>>] extends [never]
    ? never
    : FluentNode<
        ApplyCaptureBagToNode<
          Node,
          BagFromSingle<ExtractCaptures<Node>, NormalizeCaptured<NewValue>>
        >
      >;

  /** Bag map overload (any number of captures). */
  map<NewBag>(
    fn: (bag: ExtractCaptures<Node>) => NewBag
  ): FluentNode<ApplyCaptureBagToNode<Node, NormalizeBag<NewBag>>>;
};

// Helper types for single-capture ergonomics
type SingleValueOf<T> = SingleKeyOf<T> extends infer K ? T[K & keyof T] : never;
type BagFromSingle<T, V> = SingleKeyOf<T> extends infer K
  ? { [P in K & keyof T]: V }
  : never;

/**
 * Apply a mapped capture bag `B` to the node shape `N` by structurally
 * refining embedded capture/spread tokens.
 *
 * - Capture<'name', _> → Capture<'name', B['name']> (if present in B)
 * - Spread<'name', Elem> → Spread<'name', ElemN> when B['name'] is
 *   ReadonlyArray<ElemN>
 * - Recurse through tuples, arrays, and objects.
 */
type UnwrapFluent<T> = T extends FluentNode<infer N> ? N : T;
type Rehydrate<T> = T extends { type: infer Tag }
  ? Extract<TSESTree.Node, { type: Tag }>
  : T;
type CollapseCategories<T> = [T] extends [TSESTree.Expression]
  ? TSESTree.Expression
  : [T] extends [TSESTree.Statement]
  ? TSESTree.Statement
  : T;
type NormalizeCaptured<V> = CollapseCategories<Rehydrate<UnwrapFluent<V>>>;
type NormalizeBag<B> = {
  [K in keyof B]: CollapseCategories<Rehydrate<UnwrapFluent<B[K]>>>;
};

type ApplyCaptureBagToNode<Node, CaptureBag> =
  // Refine explicit captures by name
  Node extends Capture<infer Name, infer _V>
    ? Name extends keyof CaptureBag
      ? Capture<Name & string, NormalizeCaptured<CaptureBag[Name]>>
      : Node
    : // Refine spread captures when bag provides a readonly array type
    Node extends Spread<infer SName, infer Elem>
    ? SName extends keyof CaptureBag
      ? CaptureBag[SName] extends ReadonlyArray<infer ElemN>
        ? Spread<SName & string, NormalizeCaptured<ElemN>>
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
