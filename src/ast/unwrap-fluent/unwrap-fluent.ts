import type { FluentNode } from "@/ast/fluent-node";

/**
 * UnwrapFluent<T>
 *
 * If `T` is a `FluentNode<N>`, yields `N`; otherwise yields `T` unchanged.
 * Useful for normalizing helper inputs that may be wrapped in the fluent API.
 */
export type UnwrapFluent<T> = T extends FluentNode<infer N> ? N : T;
