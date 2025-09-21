import type { $ } from "@/capture/dollar";
import type { Capture } from "@/capture/capture-type";
import type { Spread } from "@/capture/spread/spread";

/**
 * Bind capture names and value types in a pattern `P` using a reference `Shape`.
 *
 * - Implicit placeholders at key `K` become `Capture<K, Shape[K]>`.
 * - Explicit `Capture<Name, V>` retains `V`; if `V` is `unknown`, it upgrades
 *   to the corresponding type from `Shape` at that position.
 * - Recurses through objects, tuples, and arrays.
 */
export type BindCaptures<P, Shape> = BindAttribute<P, Shape, "">;

// Build a tuple of captures from a tuple shape `S`, preserving per-index types.
type TupleCaptures<
  S extends readonly unknown[],
  Acc extends readonly unknown[] = []
> = S extends readonly [infer H, ...infer R]
  ? TupleCaptures<
      R extends readonly unknown[] ? R : never,
      [...Acc, Capture<`${Acc["length"] & number}`, H>]
    >
  : Acc;

type BindAttribute<P, S, Key extends string> =
  // Implicit placeholder becomes named capture with the property key
  P extends $
    ? Key extends ""
      ? S extends readonly any[]
        ? number extends S["length"]
          ? ReadonlyArray<Capture<`${number}`, S[number]>>
          : Readonly<TupleCaptures<S>>
        : S extends object
        ? { [K in keyof S]: Capture<K & string, S[K]> }
        : never
      : Capture<Key, S>
    : // Explicit capture keeps provided value type; if unknown, upgrade to S
    P extends Capture<infer Name, infer V>
    ? Capture<Name & string, unknown extends V ? S : V>
    : // Spread capture in sequence positions: bind element type from S[number]
    P extends Spread<infer Name, infer Elem>
    ? S extends readonly any[]
      ? Spread<
          Name & string,
          unknown extends Elem ? S[number] : Elem & S[number]
        >
      : Spread<Name & string, Elem>
    : // Tuples/arrays: align with S if tuple or array
    P extends readonly [...infer PI]
    ? S extends readonly any[]
      ? number extends S["length"]
        ? Readonly<{
            [I in keyof PI]: PI[I] extends Spread<any, any>
              ? BindAttribute<PI[I], S, `${I & string}`>
              : BindAttribute<PI[I], S[number], `${I & string}`>;
          }>
        : Readonly<{
            [I in keyof PI]: PI[I] extends Spread<any, any>
              ? BindAttribute<PI[I], S, `${I & string}`>
              : BindAttribute<PI[I], S[I & number], `${I & string}`>;
          }>
      : Readonly<{
          [I in keyof PI]: BindAttribute<PI[I], unknown, `${I & string}`>;
        }>
    : // Objects: map each property using its key; align with S if available.
    // Omit function-valued keys except the `$` token type.
    P extends object
    ? {
        [K in keyof P as P[K] extends (...args: any) => any
          ? P[K] extends $
            ? K & string
            : never
          : K & string]: BindAttribute<
          P[K],
          K extends keyof S ? S[K] : unknown,
          K & string
        >;
      }
    : // Primitives and other types are left as-is
      P;
