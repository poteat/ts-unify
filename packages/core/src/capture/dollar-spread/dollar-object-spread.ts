import type { OBJECT_SPREAD_BRAND } from './object-spread-brand'

/**
 * Type-only brand on an object pattern written with `{ ...$ }`: the binder
 * then captures every key of the shape the pattern leaves unmentioned.
 */
export type DollarObjectSpread = { readonly [OBJECT_SPREAD_BRAND]: true }
