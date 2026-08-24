import type { FLUENT_INNER } from '@/ast/fluent-node'

/**
 * The plain shape `N` of a `FluentNode<N>`; any other type unchanged.
 * Reads the brand, so inference skips the fluent intersection.
 */
export type UnwrapFluent<T> = T extends { readonly [FLUENT_INNER]: infer N }
  ? N
  : T
