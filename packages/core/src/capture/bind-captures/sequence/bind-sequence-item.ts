import type { BindNode } from '@/capture/bind-captures/bind-node'
import type { ElemAt } from '@/capture/bind-captures/shape'
import type { Spread } from '@/capture/spread'

import type { SpreadElem } from './spread-elem'

/**
 * One item of a sequence pattern bound against an array shape.
 *
 * A spread refines its element type and, when anonymous, takes the key of
 * the property holding the sequence; any other item binds against the
 * shape's element at its index.
 *
 * @typeParam Item pattern item
 * @typeParam S array or tuple shape
 * @typeParam I index of the item
 * @typeParam ParentKey key of the property holding the sequence
 */
export type BindSequenceItem<
  Item,
  S extends readonly unknown[],
  I extends PropertyKey,
  ParentKey extends string,
> =
  Item extends Spread<infer Name, infer Elem>
    ? Spread<(Name extends '' ? ParentKey : Name) & string, SpreadElem<Elem, S>>
    : BindNode<Item, ElemAt<S, I>, `${I & string}`>
