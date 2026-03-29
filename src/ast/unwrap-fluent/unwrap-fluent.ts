import type { FLUENT_INNER } from "@/ast/fluent-node";

/**
 * UnwrapFluent<T>
 *
 * If `T` is a `FluentNode<N>`, yields `N`; otherwise yields `T` unchanged.
 * Uses the symbol brand so inference doesn't traverse the full FluentNode
 * intersection.
 */
export type UnwrapFluent<T> = T extends { readonly [FLUENT_INNER]: infer N }
  ? N
  : T;
