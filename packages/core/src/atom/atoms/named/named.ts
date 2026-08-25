import type { Deps } from '@/atom/deps'
import type { Atom } from '@/atom/slot'
import type { ValueOf } from '@/atom/value-of'

/**
 * A table of slots with each entry named by its key: what `atoms` returns.
 *
 * @typeParam T the table given, an object of slots
 */
export type Named<T extends Deps> = {
  readonly [K in keyof T]: Atom<ValueOf<T[K]>, K & string>
}
