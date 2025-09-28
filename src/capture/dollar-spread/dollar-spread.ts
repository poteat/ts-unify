/**
 * DollarObjectSpread
 *
 * Type-only brand that marks an object pattern as using object spread-$
 * semantics when `{ ...$ }` is present. Runtime is intentionally inert.
 */
export declare const OBJECT_SPREAD_BRAND: unique symbol;
export type DollarObjectSpread = { readonly [OBJECT_SPREAD_BRAND]: true };
