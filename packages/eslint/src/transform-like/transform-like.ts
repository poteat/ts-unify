import type { ProxyNode } from '@ts-unify/core/internal'

import type { MatchLike } from './matches'

/**
 * Any value produced by the fluent API: a bare pattern or one with `.to()`.
 */
export type TransformLike = MatchLike | { readonly [k: symbol]: ProxyNode }
