import type { ExtractCaptures } from "@/pattern";
import type { SingleKeyOf } from "@/type-utils/single-key-of";
import type { FluentNode } from "@/ast/fluent-node";
import type { SubstituteCaptures } from "@/ast/substitute-captures";
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
        SubstituteCaptures<
          Node,
          BagFromSingle<ExtractCaptures<Node>, NormalizeCaptured<NewValue>>
        >
      >;

  /** Bag map overload (any number of captures). */
  map<NewBag>(
    fn: (bag: ExtractCaptures<Node>) => NewBag
  ): FluentNode<SubstituteCaptures<Node, NormalizeBag<NewBag>>>;
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
