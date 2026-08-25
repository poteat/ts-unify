import type { Deps } from '@/atom/deps'
import type { ValueOf } from '@/atom/value-of'

/**
 * The object a read function receives: the deps with each slot replaced by
 * the value type it carries.
 *
 * @typeParam D the deps, an object of slots
 */
export type Of<D extends Deps> = {
  readonly [K in keyof D]: ValueOf<D[K]>
}
