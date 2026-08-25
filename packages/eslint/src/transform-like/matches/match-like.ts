import type { FLUENT_INNER } from '@ts-unify/core/internal'

/**
 * A fluent pattern without `.to()`: the rule reports each match as is.
 */
export type MatchLike = { readonly [FLUENT_INNER]: unknown }
