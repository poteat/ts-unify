import type { Keyed } from '@/atom/keyed'

/**
 * What a definition reads, by name: each member a slot, written once as a
 * value, never as a separate type.
 */
export type Deps = { readonly [name: string]: Keyed }
