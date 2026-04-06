import { CAPTURE_BRAND } from "@/capture/capture-type";
import { SPREAD_BRAND } from "@/capture/spread/spread";
/**
 * Symbol marker that `{ ...$ }` copies into the pattern object to signal
 * that unmatched properties should be captured into the bag at runtime.
 */
export const REST_CAPTURE = Symbol.for("ts-unify.rest-capture");
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
const __dollar = ((name) => {
    // Create capture token object
    const obj = {
        [CAPTURE_BRAND]: true,
        name,
    };
    // Define iterator as non-enumerable so `{ ...$ }` spreads nothing
    Object.defineProperty(obj, Symbol.iterator, {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function* () {
            // Yield a single spread token for sequence spread sugar `...$('name')`.
            // The spread token is a type-level marker; runtime consumers may inspect
            // the brand and name when interpreting sequence patterns.
            const token = { [SPREAD_BRAND]: true, name };
            yield token;
        },
    });
    return Object.freeze(obj);
    // The intermediate type is `unknown` because __dollar must satisfy a complex
    // intersection (DollarObjectSpread & Iterable & FluentOps) that cannot be
    // expressed as a function literal.  The final export re-casts to `$`.
});
// Also allow anonymous sequence spread with `...$` by making the function itself
// iterable. The yielded spread has an empty name which is re-keyed by
// type-level binders using the containing property key.
Object.defineProperty(__dollar, Symbol.iterator, {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function* () {
        const token = { [SPREAD_BRAND]: true, name: "" };
        yield token;
    },
});
// Mark `$` with an enumerable Symbol property so that `{ ...$ }` copies
// the REST_CAPTURE marker into the resulting pattern object.
Object.defineProperty(__dollar, REST_CAPTURE, {
    enumerable: true,
    configurable: false,
    writable: false,
    value: true,
});
export const $ = __dollar;
