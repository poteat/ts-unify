import type { BindNode } from '@/capture/bind-captures/bind-node'

import type { BindSequenceItem } from './bind-sequence-item'

/**
 * A tuple or array pattern bound item by item: against the array shape's
 * positions when the shape is one, else against `unknown`.
 *
 * @typeParam Items pattern items
 * @typeParam S shape at the sequence's position
 * @typeParam Key key of the property holding the sequence
 */
export type BindSequence<
  Items extends readonly unknown[],
  S,
  Key extends string,
> = S extends readonly unknown[]
  ? Readonly<{
      [I in keyof Items]: BindSequenceItem<Items[I], S, I & PropertyKey, Key>
    }>
  : Readonly<{
      [I in keyof Items]: BindNode<Items[I], unknown, `${I & string}`>
    }>
