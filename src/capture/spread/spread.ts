/** @internal Branding symbol for the Spread token */
export const SPREAD_BRAND = Symbol("SPREAD_BRAND");

/**
 * Sequence-only capture token for contiguous slice positions in arrays/tuples.
 *
 * The generic parameter `Elem` denotes the element type of the captured slice.
 * This is a type-level marker; semantics are defined by consumers.
 */
export type Spread<Name extends string = string, Elem = unknown> = {
  readonly [SPREAD_BRAND]: true;
  readonly name: Name;
  readonly value?: Elem;
};
