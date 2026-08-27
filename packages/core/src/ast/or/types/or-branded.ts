import type { OR_BRAND } from './brand'

/**
 * The brand record of an or-node alone, by which a walker tells a
 * disjunction from a plain node before it strips the brand off.
 */
export type OrBranded = { readonly [OR_BRAND]: true }
