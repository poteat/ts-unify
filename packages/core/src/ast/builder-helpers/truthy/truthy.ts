import type { Falsy } from './types'

/**
 * Removes the falsy constituents from a type.
 */
export type Truthy<T> = Exclude<T, Falsy>
