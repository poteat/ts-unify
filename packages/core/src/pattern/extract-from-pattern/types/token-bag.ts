import type { NamedToken } from './token'

/**
 * The one-entry bag of a token: its `name` as the key, valued by what its
 * phantom `value` produces; `{}` for a token without a name.
 */
export type TokenBag<T> =
  T extends NamedToken<infer Name extends string, infer V>
    ? { [K in Name]: V }
    : {}
