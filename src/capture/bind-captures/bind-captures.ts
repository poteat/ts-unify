import type { $ } from "@/capture/dollar";
import type { OBJECT_SPREAD_BRAND } from "@/capture/dollar-spread/dollar-spread";
import type { Capture } from "@/capture/capture-type";
import type { Spread } from "@/capture/spread/spread";
import type { TSESTree } from "@typescript-eslint/types";
import type { Sealed } from "@/ast/sealed";
import type { OR_BRAND } from "@/ast/or";
import type { CAPTURE_MODS_BRAND } from "@/capture/capture-mods/capture-mods";
import type { Truthy } from "@/ast/builder-helpers";

/**
 * Bind capture names and value types in a pattern `P` using a reference `Shape`.
 *
 * - Implicit placeholders at key `K` become `Capture<K, Shape[K]>`.
 * - Explicit `Capture<Name, V>` retains `V`; if `V` is `unknown`, it upgrades
 *   to the corresponding type from `Shape` at that position.
 * - Recurses through objects, tuples, and arrays.
 */

// ————— Small helpers to clarify intent —————
type StripSeal<T> = T extends Sealed<infer Inner> ? Inner : T;
type StripOr<T> = T extends { readonly [OR_BRAND]: true }
  ? Omit<T, typeof OR_BRAND>
  : T;

type KeyStr<K> = K & string;
type ShapeAt<S, K extends PropertyKey> = K extends keyof S ? S[K] : unknown;

type IsTuple<S extends readonly any[]> = number extends S["length"]
  ? false
  : true;
type ArrayElem<S extends readonly any[]> = S[number];
type ElemAt<
  S extends readonly any[],
  I extends keyof any
> = IsTuple<S> extends true ? S[I & number] : ArrayElem<S>;

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

// Keys to consider from a pattern object:
// - Exclude 'parent'
// - Exclude function-valued keys except when the value is the $ sentinel
type PatternKeys<P extends object> = {
  [K in keyof P]-?: K extends "parent"
    ? never
    : P[K] extends (...args: any) => any
    ? P[K] extends $
      ? KeyStr<K>
      : never
    : KeyStr<K>;
}[keyof P];

// Sequence item binder: spreads refine with S, non-spreads bind against ElemAt
type BindSequenceItem<
  Item,
  S extends readonly any[],
  I extends keyof any,
  ParentKey extends string
> = Item extends Spread<infer Name, infer Elem>
  ? Spread<
      (Name extends "" ? ParentKey : Name) & string,
      unknown extends Elem ? ArrayElem<S> : Extract<Elem, ArrayElem<S>>
    >
  : BindNode<Item, ElemAt<S, I>, `${I & string}`>;

// ————— Value binder (leaves concrete nodes untouched) —————
type ExtractMods<P> = P extends { readonly [CAPTURE_MODS_BRAND]: infer M }
  ? M
  : {};

type ApplyMods<Base, Mods> = Mods extends infer M
  ? // Default substitution takes precedence
    (
      M extends { default: infer D }
        ? D
        : // Map substitution next
        M extends { map: infer New }
        ? New
        : Base
    ) extends infer V0
    ? // When guard narrowing
      (M extends { when: infer Narrow } ? Narrow : V0) extends infer V1
      ? // Truthy narrowing last
        M extends { truthy: true }
        ? Truthy<V1>
        : V1
      : never
    : never
  : Base;

type BindValue<P, S, Key extends string> =
  // Short-circuit: don't recurse into concrete AST nodes
  P extends TSESTree.Node
    ? P
    : // Placeholder becomes named capture using key context
    P extends $
    ? Key extends ""
      ? S extends readonly any[]
        ? IsTuple<S> extends true
          ? Readonly<TupleCaptures<S>>
          : ReadonlyArray<Capture<`${number}`, ArrayElem<S>>>
        : S extends object
        ? { [K in keyof S]: Capture<K & string, S[K]> }
        : never
      : Capture<Key, ApplyMods<S, ExtractMods<P>>>
    : // Explicit capture: upgrade unknown value type to the shape at position
    P extends Capture<infer Name, infer V>
    ? Capture<
        Name & string,
        ApplyMods<unknown extends V ? S : V, ExtractMods<P>>
      >
    : // Spread in sequences: refine element using array element type
    P extends Spread<infer Name, infer Elem>
    ? S extends readonly any[]
      ? Spread<
          Name & string,
          unknown extends Elem ? ArrayElem<S> : Extract<Elem, ArrayElem<S>>
        >
      : Spread<Name & string, Elem>
    : // Sequences (tuples/arrays)
    P extends readonly [...infer Items]
    ? S extends readonly any[]
      ? Readonly<{
          [I in keyof Items]: BindSequenceItem<Items[I], S, I & keyof any, Key>;
        }>
      : Readonly<{
          [I in keyof Items]: BindNode<Items[I], unknown, `${I & string}`>;
        }>
    : // Objects — map over filtered keys and optionally add spread extras
    P extends object
    ? {
        [K in PatternKeys<P>]: BindNode<
          P[Extract<K, keyof P>],
          ShapeAt<S, Extract<K, keyof any>>,
          KeyStr<K>
        >;
      } & (P extends { readonly [OBJECT_SPREAD_BRAND]: true }
        ? {
            [K in Exclude<keyof S, keyof P> & string]: Capture<
              K,
              K extends keyof S ? S[K] : never
            >;
          }
        : {})
    : // Primitives and other types are left as-is
      P;

// ————— Main dispatcher —————
type BindNode<P, S, Key extends string> = P extends {
  readonly [OR_BRAND]: true;
}
  ? BindNode<StripOr<P>, S, Key>
  : P extends Sealed<infer _Inner>
  ? Sealed<BindValue<StripSeal<P>, S, Key>>
  : BindValue<P, S, Key>;

export type BindCaptures<P, Shape> = BindNode<P, Shape, "">;
