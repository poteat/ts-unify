import type { Deps } from '@/atom/deps'
import type { Atom } from '@/atom/slot'

/**
 * The object a read function receives: the deps with each slot replaced by
 * the type it carries.
 *
 * @typeParam D the deps, an object of slots
 */
export type Of<D extends Deps> = {
  readonly [K in keyof D]: D[K] extends Atom<infer T> ? T : never
}
