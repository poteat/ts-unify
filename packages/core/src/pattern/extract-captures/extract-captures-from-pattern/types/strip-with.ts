import type NodeWithWithTypes from '@/ast/node-with-with/types'

/**
 * A pattern with its `__with` bag taken off; a pattern without one passes
 * through as it is.
 */
export type StripWith<T> =
  T extends NodeWithWithTypes.WithBranded<unknown> ? Omit<T, '__with'> : T
