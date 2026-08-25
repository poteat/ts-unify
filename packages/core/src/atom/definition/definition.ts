import type { Deps } from '@/atom/deps'
import type { Of } from '@/atom/of'
import type { Atom } from '@/atom/slot'

/**
 * The slot a definition fills, the slots it reads, and the function that
 * reads their values into a value of the slot's type.
 *
 * @typeParam T the type of the slot filled
 * @typeParam D the deps, an object of slots
 */
export type Definition<T, D extends Deps> = {
  readonly slot: Atom<T>
  readonly deps: D

  /**
   * Builds the value, once, from the values of the deps.
   */
  readonly read: (deps: Of<D>) => T
}
