import type { Falsy } from './falsy'

/**
 * Removes the falsy constituents from a type.
 */
export type Truthy<T> = Exclude<T, Falsy>
