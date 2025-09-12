const CAPTURE_BRAND = Symbol("CAPTURE_BRAND");

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

/**
 * Creates a capture sentinel with a literal-typed name.
 *
 * @example
 * const pattern = { userId: $("id"), userName: $("name") };
 *
 * @param name - Unique identifier for this capture
 */
export const $ = <const Name extends string>(name: Name): Capture<Name> =>
  ({
    [CAPTURE_BRAND]: true,
    name,
  } as Capture<Name>);

/**
 * Type guard to check if a value is a capture sentinel.
 */
export const isCapture = (value: unknown): value is Capture =>
  (value as any)?.[CAPTURE_BRAND] === true;
