/**
 * What a parameter collapses to in place of a provider when a declared
 * dependency is not registered, so the error names the provider.
 *
 * @typeParam M the missing providers' types
 */
export type MissingDeps<M> = { readonly missing: M }
