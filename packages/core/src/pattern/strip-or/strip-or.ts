import type { OR_BRAND } from '@/ast/or'
import type OrTypes from '@/ast/or/types'

/**
 * The branches of an or-combinator, with its brand taken off; any other
 * type passes through as it is.
 */
export type StripOr<T> = T extends OrTypes.OrBranded
  ? Omit<T, typeof OR_BRAND>
  : T
