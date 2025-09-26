/**
 * Sealed<N>
 *
 * Type-level brand applied by `.seal()`. When a sealed subtree is used as the
 * value of an object property in a larger pattern, capture extraction may
 * re-key a single inner capture to the embedding property name.
 */
export type Sealed<N> = N & { readonly __sealed__: true };

