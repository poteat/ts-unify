export const CAPTURE_BRAND = Symbol("CAPTURE_BRAND");

/**
 * Sentinel value that marks a position in a pattern for type extraction.
 * Preserves literal name type for compile-time pattern matching.
 *
 * @typeParam Name - Unique identifier for this capture
 */
export type Capture<Name extends string = string> = {
  readonly [CAPTURE_BRAND]: true;
  readonly name: Name;
};
