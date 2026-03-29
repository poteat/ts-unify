export const CAPTURE_BRAND = Symbol("CAPTURE_BRAND");

/**
 * Sentinel value that marks a position in a pattern for type extraction.
 * Preserves literal name type for compile-time pattern matching.
 *
 * @typeParam Name - Unique identifier for this capture
 * @typeParam Value - Expected type of the captured value (defaults to unknown)
 */
export type Capture<Name extends string = string, Value = unknown> = {
  readonly [CAPTURE_BRAND]: true;
  readonly name: Name;
  readonly value?: Value;
};
