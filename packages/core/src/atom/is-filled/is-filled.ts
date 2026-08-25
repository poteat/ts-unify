/**
 * Whether a store type fills a slot, read off its `accepts` phantom.
 *
 * The phantom takes the filled slots in parameter position, so a union of
 * store types answers `boolean` unless every branch fills the slot.
 *
 * @typeParam C the store's type, as narrowed at the call
 * @typeParam S the slot's type
 */
export type IsFilled<C, S> = C extends { readonly accepts?: infer A }
  ? NonNullable<A> extends (slot: S) => void
    ? true
    : false
  : false
