import type { Deps } from '@/atom/deps'
import type { Keyed } from '@/atom/keyed'
import type { Of } from '@/atom/of'
import type { ValueOf } from '@/atom/value-of'

/**
 * The slot a definition fills, the slots it reads, and the function that
 * reads their values into a value of the slot's type.
 *
 * @typeParam A the slot filled, an `Atom` alias
 * @typeParam D the deps, an object of slots
 */
export type Definition<A extends Keyed, D extends Deps> = {
  readonly slot: A
  readonly deps: D

  /**
   * Builds the value, once, from the values of the deps.
   */
  readonly read: (deps: Of<D>) => ValueOf<A>
}
