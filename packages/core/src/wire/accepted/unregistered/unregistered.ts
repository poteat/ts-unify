/**
 * What the parameter of `get` collapses to when the provider asked for is
 * not registered, so the error names it.
 *
 * @typeParam P the provider's type
 */
export type Unregistered<P> = { readonly unregistered: P }
