import type { FluentNode } from '@/ast/fluent-node'

import type { OR_BRAND } from './brand'

/**
 * A fluent node over a union of branches, as `U.or` and `U.maybeBlock`
 * return: the engine tries each branch in order.
 */
export type OrNode<N> = FluentNode<N> & { readonly [OR_BRAND]: true }
