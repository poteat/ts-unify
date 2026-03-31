import type { UnionToIntersection, Values } from "@/type-utils";
import type { Sealed } from "@/ast/sealed";
import type { OR_BRAND } from "@/ast/or";
import type { TSESTree } from "@typescript-eslint/types";
import type { StripSeal } from "@/pattern/strip-seal";
import type { StripOr } from "@/pattern/strip-or";
import type { CoalesceUnionOfBags } from "@/pattern/coalesce-union-of-bags";

type Walk<P, Token> = {
  [K in keyof P]-?: CoalesceUnionOfBags<PropertyValue<P[K], Token>>;
} extends infer M
  ? Values<M & {}> extends infer U
    ? [U] extends [never]
      ? {}
      : UnionToIntersection<U>
    : never
  : never;

type PropertyValue<T, Token> = T extends TSESTree.Node
  ? {}
  : T extends Token
    ? T extends { readonly name: infer Name extends string; readonly value?: infer V }
      ? { [K in Name]: V }
      : {}
    : T extends object
      ? Walk<T, Token>
      : {};

/**
 * Generic pattern walker that recursively extracts named tokens from a
 * pattern structure. Parameterized by `Token` — the branded type to
 * collect (e.g. `Capture` or `ConfigSlot`).
 */
export type ExtractFromPattern<P, Token, Key extends string = ""> =
  P extends Sealed<infer _Inner>
    ? ExtractFromPattern<StripSeal<P>, Token, Key>
    : P extends { readonly [OR_BRAND]: true }
      ? StripOr<P> extends infer U
        ? U extends any
          ? ExtractFromPattern<U, Token, Key>
          : never
        : never
      : P extends TSESTree.Node
        ? {}
        : P extends Token
          ? P extends { readonly name: infer Name extends string; readonly value?: infer V }
            ? { [K in Name]: V }
            : {}
          : P extends readonly [...infer Items]
            ? UnionToIntersection<
                {
                  [K in keyof Items]: ExtractFromPattern<Items[K], Token, `${K & string}`>;
                }[number]
              >
            : P extends object
              ? Walk<P, Token>
              : {};
