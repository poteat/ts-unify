import type { FLUENT_INNER } from '@/ast/fluent-node/brand'

/**
 * The brand record of a fluent node: its plain shape `N` under
 * `FLUENT_INNER`, matched alone so inference skips the fluent helpers.
 */
export type FluentBranded<N> = { readonly [FLUENT_INNER]: N }
