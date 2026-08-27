import type { FluentBranded } from '@/ast/fluent-node'

/**
 * The plain shape `N` of a `FluentNode<N>`; any other type unchanged.
 * Reads the brand, so inference skips the fluent intersection.
 */
export type UnwrapFluent<T> = T extends FluentBranded<infer N> ? N : T
