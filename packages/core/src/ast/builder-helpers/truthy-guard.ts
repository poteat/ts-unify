import type { Truthy } from './truthy'

/**
 * A type guard that refines its argument to `Truthy<T>`.
 */
export type TruthyGuard = <T>(x: T) => x is Truthy<T>
