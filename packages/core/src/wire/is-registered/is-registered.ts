/**
 * Whether a container type accepts a provider, read off its `accepts`
 * phantom.
 *
 * Any member of an intersection may accept it; every branch of a union
 * must.
 *
 * @typeParam C the container's type, as narrowed at the call
 * @typeParam P the provider's type
 */
export type IsRegistered<C, P> = C extends { readonly accepts?: infer Accepts }
  ? NonNullable<Accepts> extends (provider: P) => void
    ? true
    : false
  : false
