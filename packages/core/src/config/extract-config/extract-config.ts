import type { ConfigSlot } from "@/config/config-type";
import type { Prettify, UnionToIntersection, Values, KeysOfUnion } from "@/type-utils";
import type { Sealed } from "@/ast/sealed";
import type { OR_BRAND } from "@/ast/or";
import type { TSESTree } from "@typescript-eslint/types";

type StripSeal<T> = T extends Sealed<infer Inner> ? Inner : T;
type StripOr<T> = T extends { readonly [OR_BRAND]: true }
  ? Omit<T, typeof OR_BRAND>
  : T;

type CoalesceUnionOfBags<U> = {
  [K in KeysOfUnion<U>]: U extends any
    ? K extends keyof U
      ? U[K]
      : never
    : never;
};

type ExtractConfigFromPropertyValue<T> = T extends TSESTree.Node
  ? {}
  : T extends ConfigSlot<infer Name, infer V>
  ? { [K in Name]: V }
  : T extends object
  ? ExtractConfigFromPattern<T>
  : {};

type ExtractConfigFromPattern<P> =
  P extends Sealed<infer _Inner>
    ? ExtractConfigFromPattern<StripSeal<P>>
    : P extends { readonly [OR_BRAND]: true }
    ? StripOr<P> extends infer U
      ? U extends any
        ? ExtractConfigFromPattern<U>
        : never
      : never
    : P extends { readonly __with: infer _WB }
    ? ExtractConfigFromPattern<Omit<P, "__with">>
    : P extends TSESTree.Node
    ? {}
    : P extends ConfigSlot<infer Name, infer V>
    ? { [K in Name]: V }
    : P extends readonly [...infer Items]
    ? UnionToIntersection<
        { [K in keyof Items]: ExtractConfigFromPattern<Items[K]> }[number]
      >
    : P extends object
    ? Values<{
        [K in keyof P]-?: CoalesceUnionOfBags<
          ExtractConfigFromPropertyValue<P[K]>
        >;
      }> extends infer U
      ? [U] extends [never]
        ? {}
        : UnionToIntersection<U>
      : never
    : {};

/** Extract config slot names and types from a pattern or output shape. */
export type ExtractConfig<Pattern> = Prettify<ExtractConfigFromPattern<Pattern>>;
