import type { Capture } from "@/capture";
import type { $ } from "@/capture";
import type { Spread } from "@/capture";
import type { ConfigSlot } from "@/config/config-type";
import type {
  Prettify,
  UnionToIntersection,
  Values,
  KeysOfUnion,
} from "@/type-utils";
import type { SingleKeyOf } from "@/type-utils/single-key-of";
import type { Sealed } from "@/ast/sealed";
import type { Overwrite } from "@/type-utils";
import type { OR_BRAND } from "@/ast/or";
import type { TSESTree } from "@typescript-eslint/types";

type StripSeal<T> = T extends Sealed<infer Inner> ? Inner : T;
type StripOr<T> = T extends { readonly [OR_BRAND]: true }
  ? Omit<T, typeof OR_BRAND>
  : T;
type StripWith<T> = T extends { readonly __with: any } ? Omit<T, "__with"> : T;

type ReKeyIfSingle<Bag, K extends string> = [SingleKeyOf<Bag>] extends [never]
  ? Bag
  : { [P in K]: Bag extends any ? Bag[SingleKeyOf<Bag>] : never };

type CoalesceUnionOfBags<U> = {
  [K in KeysOfUnion<U>]: U extends any
    ? K extends keyof U
      ? U[K]
      : never
    : never;
};

type ExtractFromPropertyValue<T, Key extends string> = T extends TSESTree.Node
  ? {}
  : T extends ConfigSlot
  ? {}
  : T extends Capture
  ? T extends Capture<infer Name, infer V>
    ? { [K in Name]: V }
    : {}
  : T extends $
  ? { [K in Key]: unknown }
  : T extends object
  ? ExtractCapturesFromPattern<T, Key>
  : {};

/**
 * Capture-specific pattern walker. Delegates structural recursion to
 * ExtractFromPattern for the common cases, but handles capture-only
 * concerns: $, Spread, __with, __only, and ReKeyIfSingle for sealed nodes.
 */
type ExtractCapturesFromPattern<P, Key extends string = ""> =
  // Sealed subtree: extract inner and (under a property key) re-key if single
  P extends Sealed<infer _Inner>
    ? Key extends ""
      ? ExtractCapturesFromPattern<StripSeal<P>, "">
      : ReKeyIfSingle<ExtractCapturesFromPattern<StripSeal<P>, "">, Key>
    : // Or-combinator wrapper: distribute extraction over branches
    P extends { readonly [OR_BRAND]: true }
    ? StripOr<P> extends infer U
      ? U extends any
        ? ExtractCapturesFromPattern<U, Key>
        : never
      : never
    : // Merge in branded bag additions from `.with(...)` if present
    P extends { readonly __with: infer WB }
    ? Overwrite<ExtractCapturesFromPattern<StripWith<P>, Key>, WB & {}>
    : // Exclusive bind: use only the bind bag, suppress structural captures
    P extends { readonly __only: infer OB }
    ? OB & {}
    : // Short circuit: don't recurse into generic nodes
    P extends TSESTree.Node
    ? {}
    : // Check if it's the $ function (implicit capture)
    P extends $
    ? Key extends ""
      ? {}
      : { [K in Key]: unknown }
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
            [K in keyof Items]: Items[K] extends Spread<infer Name, infer Elem>
              ? Name extends ""
                ? Key extends ""
                  ? ExtractCapturesFromPattern<Items[K], `${K & string}`>
                  : { [PKey in Key]: ReadonlyArray<Elem> }
                : ExtractCapturesFromPattern<Items[K], `${K & string}`>
              : ExtractCapturesFromPattern<Items[K], `${K & string}`>;
          }[number]
        >
    : // Handle objects
    P extends object
    ? {
        [K in keyof P]-?: CoalesceUnionOfBags<
          ExtractFromPropertyValue<P[K], K & string>
        >;
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
 * Extract capture names and types from a pattern.
 *
 * @example
 * type P1 = { value: Capture<"v", number> };
 * type R1 = ExtractCaptures<P1>; // { v: number }
 *
 * @example
 * type P2 = { id: $; name: $ };
 * type R2 = ExtractCaptures<P2>; // { id: unknown; name: unknown }
 */
export type ExtractCaptures<Pattern> = Prettify<
  ExtractCapturesFromPattern<Pattern>
>;
