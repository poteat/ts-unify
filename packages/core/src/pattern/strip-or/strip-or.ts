import type { OR_BRAND } from '@/ast/or'

/**
 * The branches of an or-combinator, with its brand taken off; any other
 * type passes through as it is.
 */
export type StripOr<T> = T extends { readonly [OR_BRAND]: true }
  ? Omit<T, typeof OR_BRAND>
  : T
