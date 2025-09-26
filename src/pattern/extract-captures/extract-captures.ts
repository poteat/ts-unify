import type { Capture } from "@/capture";
import type { $ } from "@/capture";
import type { Spread } from "@/capture";
import type { Prettify, UnionToIntersection, Values } from "@/type-utils";
import type { SingleKeyOf } from "@/type-utils/single-key-of";
import type { SEALED_BRAND } from "@/ast/sealed";
import type { OR_BRAND } from "@/ast/or";
import type { TSESTree } from "@typescript-eslint/types";

type ExtractFromPropertyValue<
  T,
  Key extends string
> = T extends TSESTree.Expression
  ? {}
  : // Check if type contains a Capture (works with unions)
  T extends Capture
  ? T extends Capture<infer Name, infer V>
    ? { [K in Name]: V }
    : {}
  : T extends $
  ? { [K in Key]: unknown }
  : T extends object
  ? ExtractFromPattern<T, Key>
  : {};

type StripSeal<T> = T extends { readonly [SEALED_BRAND]: true }
  ? Omit<T, typeof SEALED_BRAND>
  : T;
type StripOr<T> = T extends { readonly [OR_BRAND]: true }
  ? Omit<T, typeof OR_BRAND>
  : T;

type ReKeyIfSingle<Bag, K extends string> = [SingleKeyOf<Bag>] extends [never]
  ? Bag
  : { [P in K]: Bag[SingleKeyOf<Bag>] };

type ExtractFromPattern<P, Key extends string = ""> =
  // Sealed subtree: extract inner and (under a property key) re-key if single
  P extends { readonly [SEALED_BRAND]: true }
    ? Key extends ""
      ? ExtractFromPattern<StripSeal<P>, "">
      : ReKeyIfSingle<ExtractFromPattern<StripSeal<P>, "">, Key>
    : // Or-combinator wrapper: distribute extraction over branches
    P extends { readonly [OR_BRAND]: true }
    ? StripOr<P> extends infer U
      ? U extends any
        ? ExtractFromPattern<U, Key>
        : never
      : never
    : // Short circuit: don't recurse into generic Expression types
    P extends TSESTree.Expression
    ? {}
    : // Check if it's the $ function (implicit capture)
    P extends $
    ? Key extends ""
      ? {} // Root-level $ doesn't capture without context
      : { [K in Key]: unknown } // Use the key as capture name
    : // Check if it's an explicit capture
    P extends Capture
    ? P extends Capture<infer Name, infer V>
      ? { [K in Name]: V }
      : never
    : // Spread capture: map to readonly element array
    P extends Spread
    ? P extends Spread<infer Name, infer Elem>
      ? { [K in Name]: ReadonlyArray<Elem> }
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
    ? {
        [K in keyof P]-?: ExtractFromPropertyValue<P[K], K & string>;
      } extends infer M
      ? Values<M & {}> extends infer U
        ? [U] extends [never]
          ? {}
          : UnionToIntersection<U>
        : never
      : never
    : // Primitives and other types don't contain captures
      {};

/**
 * Extract capture names from a pattern type. For explicit captures,
 * propagates the declared value type; for implicit placeholders, uses
 * `unknown`.
 *
 * - Supports explicit capture tokens and the placeholder token `$` in type
 *   positions.
 * - Recurses through objects, tuples, and arrays; duplicate names coalesce
 *   e.g. `{ x: number } & { x: string }` → `{ x: number & string }`.
 *
 * @example
 * type P1 = { value: Capture<"v", number> };
 * type R1 = ExtractCaptures<P1>; // { v: number }
 *
 * @example
 * type P2 = { id: $; name: $ };
 * type R2 = ExtractCaptures<P2>; // { id: unknown; name: unknown }
 */
export type ExtractCaptures<Pattern> = Prettify<ExtractFromPattern<Pattern>>;
