/**
 * A pattern with its `__with` bag taken off; a pattern without one passes
 * through as it is.
 */
export type StripWith<T> = T extends { readonly __with: unknown }
  ? Omit<T, '__with'>
  : T
