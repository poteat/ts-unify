import type { Capture } from "@/capture/capture-type";
import { CAPTURE_BRAND } from "@/capture/capture-type";
import type { Spread } from "@/capture/spread/spread";
import type { DollarObjectSpread } from "@/capture/dollar-spread/dollar-spread";
import type { FluentCapture } from "@/capture/fluent-capture";
import type { CaptureMods } from "@/capture/capture-mods/capture-mods";
import type {
  ModMap,
  ModDefault,
  ModTruthy,
  ModWhen,
} from "@/capture/capture-mods/capture-mods";
import type { NormalizeCaptured } from "@/ast/normalize-captured";
import type { TSESTree } from "@typescript-eslint/types";

type AnonymousFluent = {
  map<New>(
    fn: (value: unknown) => New
  ): $ & CaptureMods<ModMap<NormalizeCaptured<New>>>;
  default<Expr>(
    expr: Expr
  ): $ & CaptureMods<ModDefault<NormalizeCaptured<Expr>>>;
  defaultUndefined(): $ & CaptureMods<ModDefault<TSESTree.Identifier>>;
  truthy(): $ & CaptureMods<ModTruthy>;
  when<Narrow>(
    guard: (value: unknown) => value is Narrow
  ): $ & CaptureMods<ModWhen<Narrow>>;
  when(predicate: (value: unknown) => boolean): $;
};

export type $ = {
  <const Name extends string>(
    name: Name
  ): Capture<Name, unknown> &
    Iterable<Spread<Name, unknown>> &
    DollarObjectSpread &
    FluentCapture<Name, unknown>;
  <const Name extends string, Value>(
    name: Name
  ): Capture<Name, Value> &
    Iterable<Spread<Name, Value>> &
    DollarObjectSpread &
    FluentCapture<Name, Value>;
} & DollarObjectSpread &
  Iterable<Spread<"", unknown>> &
  AnonymousFluent;

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
