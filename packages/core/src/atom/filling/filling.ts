import type { Deps } from '@/atom/deps'
import type { Keyed } from '@/atom/keyed'
import type { Reader } from '@/atom/reader'

/**
 * A definition as a store holds it, its types forgotten: every
 * `Definition<T, D>` is one, and a store's tuple is constrained to them.
 */
export type Filling = {
  readonly slot: Keyed
  readonly deps: Deps

  /**
   * Its parameter is `never` to the store, which builds the deps object
   * by name at runtime.
   */
  readonly read: Reader
}
