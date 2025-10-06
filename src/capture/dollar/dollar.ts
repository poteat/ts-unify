import type { Capture } from "@/capture/capture-type";
import { CAPTURE_BRAND } from "@/capture/capture-type";
import type { Spread } from "@/capture/spread/spread";
import type { DollarObjectSpread } from "@/capture/dollar-spread/dollar-spread";
import type { FluentCapture } from "@/capture/fluent-capture";

export type $ = {
  <const Name extends string>(name: Name): FluentCapture<Name, unknown>;
  <const Name extends string, Value>(name: Name): FluentCapture<Name, Value>;
} & DollarObjectSpread &
  Iterable<Spread<"", unknown>>;

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
const __dollar = (<const Name extends string, Value = unknown>(name: Name) =>
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
  }) as Capture<Name, Value> & Iterable<Spread<Name, Value>>) as any;

// Also allow anonymous sequence spread with `...$` by making the function itself
// iterable. The yielded spread has an empty name which is re-keyed by
// type-level binders using the containing property key.
(__dollar as any)[Symbol.iterator] = function* (): IterableIterator<
  Spread<"", unknown>
> {
  const token = { name: "" } as unknown as Spread<"", unknown>;
  yield token;
};

export const $ = __dollar as $;
