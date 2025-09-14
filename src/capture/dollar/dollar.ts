import type { Capture } from "../capture-type";
import { CAPTURE_BRAND } from "../capture-type";

export type $ = <const Name extends string, Value = unknown>(
  name: Name
) => Capture<Name, Value>;

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
export const $: $ = <const Name extends string, Value = unknown>(name: Name) =>
  Object.freeze({
    [CAPTURE_BRAND]: true,
    name,
  }) as Capture<Name, Value>;
