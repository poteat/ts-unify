import type { $ } from "@/capture/dollar";
import type { Capture } from "@/capture/capture-type";

/**
 * Bind capture names and value types in a pattern `P` using a reference
 * `Shape`. This is purely type-level.
 *
 * - Implicit placeholders at key `K` become `Capture<K, Shape[K]>`.
 * - Explicit `Capture<Name, V>` retains `V`; if `V` is `unknown`, it upgrades
 *   to the corresponding type from `Shape` at that position.
 * - Recurses through objects, tuples, and arrays.
 */
export type BindCaptures<P, Shape> = BindNode<P, Shape, "">;

type BindNode<P, S, Key extends string> =
  // Implicit placeholder becomes named capture with the property key
  P extends $
    ? Key extends ""
      ? S extends readonly [...infer SI]
        ? { [I in keyof SI]: Capture<`${I & string}`, SI[I & number]> }
        : S extends readonly (infer Elem)[]
        ? ReadonlyArray<Capture<`${number}`, Elem>>
        : S extends object
        ? { [K in keyof S]: Capture<K & string, S[K]> }
        : never
      : Capture<Key, S>
    : // Explicit capture keeps provided value type; if unknown, upgrade to S
    P extends Capture<infer Name, infer V>
    ? Capture<Name & string, unknown extends V ? S : V>
    : // Tuples/arrays: align with S if tuple or array
    P extends readonly [...infer PI]
    ? S extends readonly any[]
      ? number extends S["length"]
        ? { [I in keyof PI]: BindNode<PI[I], S[number], `${I & string}`> }
        : { [I in keyof PI]: BindNode<PI[I], S[I & number], `${I & string}`> }
      : {
          [I in keyof PI]: BindNode<PI[I], unknown, `${I & string}`>;
        }
    : // Objects: map each property using its key; align with S if available
    P extends object
    ? {
        [K in keyof P]: BindNode<
          P[K],
          K extends keyof S ? S[K] : unknown,
          K & string
        >;
      }
    : // Primitives and other types are left as-is
      P;
