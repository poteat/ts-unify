import type { FLUENT_INNER, ProxyNode } from "@ts-unify/core/internal";

/** A fluent pattern without `.to()`: the rule reports each match as is. */
export type MatchLike = { readonly [FLUENT_INNER]: unknown };

/** Any value produced by the fluent API: a bare pattern or one with `.to()`. */
export type TransformLike = MatchLike | { readonly [k: symbol]: ProxyNode };
