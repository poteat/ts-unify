import type { Capture } from "../capture";
import type { $ } from "../capture";
import type { Prettify, UnionToIntersection, Values } from "../type-utils";

/**
 * Extract captures from a property value, handling unions
 * @internal
 */
type ExtractFromPropertyValue<T, Key extends string> =
  // Check if type contains a Capture (works with unions)
  T extends Capture
    ? T extends Capture<infer Name>
      ? { [K in Name]: unknown }
      : {}
    : T extends typeof $
    ? { [K in Key]: unknown }
    : T extends object
    ? ExtractFromPattern<T, Key>
    : {};

/**
 * Recursively walks a pattern structure to extract all captures.
 * Each capture maps to unknown type.
 * @internal
 */
type ExtractFromPattern<P, Key extends string = ""> =
  // Check if it's the $ function (implicit capture)
  P extends typeof $
    ? Key extends ""
      ? {} // Root-level $ doesn't capture without context
      : { [K in Key]: unknown } // Use the key as capture name
    : // Check if it's an explicit capture
    P extends Capture
    ? P extends Capture<infer Name>
      ? { [K in Name]: unknown }
      : never
    : // Handle arrays
    P extends readonly [...infer Items]
    ? Items extends readonly []
      ? {}
      : UnionToIntersection<
          {
            [K in keyof Items]: ExtractFromPattern<Items[K], `${K & string}`>;
          }[number]
        >
    : // Handle objects
    P extends object
    ? UnionToIntersection<
        Values<{
          [K in keyof P]-?: ExtractFromPropertyValue<P[K], K & string>;
        }>
      >
    : // Primitives and other types don't contain captures
      {};

/**
 * Extracts capture names from a pattern structure.
 * All captures are typed as unknown.
 * Supports both explicit captures and implicit captures using $.
 *
 * @example
 * // Explicit captures
 * type Pattern = { user: { id: Capture<"userId">; name: Capture<"name"> } };
 * type Result = ExtractCaptures<Pattern>;
 * //   ^? { userId: unknown; name: unknown }
 *
 * // Implicit captures using $
 * type Pattern2 = { user: { id: typeof $; name: typeof $ } };
 * type Result2 = ExtractCaptures<Pattern2>;
 * //   ^? { id: unknown; name: unknown }
 *
 * @typeParam Pattern - Pattern containing Capture sentinels or $ function
 */
export type ExtractCaptures<Pattern> = Prettify<ExtractFromPattern<Pattern>>;
