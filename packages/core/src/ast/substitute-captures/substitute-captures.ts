import type { IsAstNode } from '@/ast/is-ast-node'
import type { Sealed } from '@/ast/sealed'
import type { Capture } from '@/capture/capture-type'
import type { Spread } from '@/capture/spread'
import type { ConfigSlot } from '@/config/config-type'

/**
 * Applies a capture bag `Bag` to a node shape `Node`, structurally:
 * each `Capture<'name', _>` becomes `Capture<'name', Bag['name']>`.
 *
 * A `Spread<'name', Elem>` becomes `Spread<'name', ElemN>` where
 * `Bag['name']` is `ReadonlyArray<ElemN>`; a `Sealed` wrapper stays; a
 * config slot and a raw `TSESTree` node pass through unchanged.
 */
export type SubstituteCaptures<Node, Bag> =
  Node extends Sealed<infer Inner>
    ? Sealed<SubstituteCaptures<Inner, Bag>>
    : Node extends Capture<infer Name, infer _V>
      ? Name extends keyof Bag
        ? Capture<Name & string, Bag[Name]>
        : Node
      : Node extends ConfigSlot
        ? Node
        : Node extends Spread<infer SName, infer Elem>
          ? SName extends keyof Bag
            ? Bag[SName] extends ReadonlyArray<infer ElemN>
              ? Spread<SName & string, ElemN>
              : Node
            : Spread<SName & string, Elem>
          : IsAstNode<Node> extends true
            ? Node
            : Node extends readonly [...infer Items]
              ? Readonly<{
                  [I in keyof Items]: SubstituteCaptures<Items[I], Bag>
                }>
              : Node extends ReadonlyArray<infer Elem2>
                ? ReadonlyArray<SubstituteCaptures<Elem2, Bag>>
                : Node extends object
                  ? { [K in keyof Node]: SubstituteCaptures<Node[K], Bag> }
                  : Node
