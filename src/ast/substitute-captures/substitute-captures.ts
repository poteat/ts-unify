import type { Capture } from "@/capture/capture-type";
import type { Spread } from "@/capture/spread/spread";
import type { Sealed } from "@/ast/sealed";

/**
 * SubstituteCaptures<Node, Bag>
 *
 * Structurally applies a capture bag `Bag` to a node shape `Node` by:
 * - Replacing `Capture<'name', _>` with `Capture<'name', Bag['name']>`
 * - Replacing `Spread<'name', Elem>` with `Spread<'name', ElemN>` when
 *   `Bag['name']` is `ReadonlyArray<ElemN>`
 * - Recursing through tuples, arrays, and objects.
 *
 * Notes:
 * - Sealed/branding are preserved by callers; this utility only rewrites
 *   capture/spread occurrences.
 */
export type SubstituteCaptures<Node, Bag> =
  // Refine explicit captures by name
  Node extends Sealed<infer Inner>
    ? Sealed<SubstituteCaptures<Inner, Bag>>
    : Node extends Capture<infer Name, infer _V>
    ? Name extends keyof Bag
      ? Capture<Name & string, Bag[Name]>
      : Node
    : // Refine spread captures when bag provides a readonly array type
    Node extends Spread<infer SName, infer Elem>
    ? SName extends keyof Bag
      ? Bag[SName] extends ReadonlyArray<infer ElemN>
        ? Spread<SName & string, ElemN>
        : Node
      : Spread<SName & string, Elem>
    : // Tuples
    Node extends readonly [...infer Items]
    ? Readonly<{
        [I in keyof Items]: SubstituteCaptures<Items[I], Bag>;
      }>
    : // Arrays
    Node extends ReadonlyArray<infer Elem2>
    ? ReadonlyArray<SubstituteCaptures<Elem2, Bag>>
    : // Objects
    Node extends object
    ? { [K in keyof Node]: SubstituteCaptures<Node[K], Bag> }
    : // Primitives
      Node;
