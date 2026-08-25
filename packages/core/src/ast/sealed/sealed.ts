import type { SEALED_BRAND } from './brand'

/**
 * A node shape branded by `.seal()`.
 *
 * Used as the value of an object property in a larger pattern, its one
 * inner capture is re-keyed to the property's name during capture
 * extraction.
 */
export type Sealed<N> = N & { readonly [SEALED_BRAND]: true }
