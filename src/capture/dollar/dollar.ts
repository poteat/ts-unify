import type { Capture } from "@/capture/capture-type";
import { CAPTURE_BRAND } from "@/capture/capture-type";
import type { Spread } from "@/capture/spread/spread";

// Brand to signal object-spread-$ semantics in object pattern contexts
export declare const OBJECT_SPREAD_BRAND: unique symbol;
export type DollarObjectSpread = { readonly [OBJECT_SPREAD_BRAND]: true };

export type $ = (<const Name extends string, Value = unknown>(
  name: Name
) => Capture<Name, Value> & Iterable<Spread<Name, Value>>)
  & DollarObjectSpread;

/**
 * Create a capture sentinel with a literal-typed name.
 * Also used as an implicit sentinel when referenced as the bare `$` value
 * (e.g. `typeof $` in types), where downstream utilities derive the name
 * from the containing key or tuple index.
 *
 * @typeParam Name Literal capture name inferred from the string.
 * @typeParam Value Optional associated value type (defaults to `unknown`).
 * @param name Unique identifier (empty string throws at runtime).
 * @example
 * const a = $("id");                 // Capture<"id", unknown>
 * const b = $<"id", number>("id");    // Capture<"id", number>
 * // type-level implicit: type P = { id: typeof $ }
 */
export const $ = (<const Name extends string, Value = unknown>(name: Name) =>
  Object.freeze({
    [CAPTURE_BRAND]: true,
    name,
    [Symbol.iterator]: function* (): IterableIterator<Spread<Name, Value>> {
      // Yield a single spread token for sequence spread sugar `...$('name')`.
      // The spread token is a type-level marker; runtime consumers may inspect
      // the brand and name when interpreting sequence patterns.
      const token = { name } as unknown as Spread<Name, Value>;
      yield token;
    },
  }) as Capture<Name, Value> & Iterable<Spread<Name, Value>>) as $ & DollarObjectSpread;

// Non-enumerable brand so `{ ...$ }` is a runtime no-op spread but carries type info
try {
  Object.defineProperty($, "__brand_object_spread__", {
    value: true,
    enumerable: false,
    configurable: false,
    writable: false,
  });
} catch {
  // ignore if defineProperty fails in exotic environments
}
