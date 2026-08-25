import type { Keyed } from '@/atom/keyed'
import type { Atom } from '@/atom/slot'

/**
 * The type of the slot `atom<T>()` declares: `T` itself when it is an
 * `Atom` alias, else the unnamed `Atom<T>` over the value type `T`.
 *
 * The check is over `[T]`, so a union value type such as
 * `string | undefined` declares one slot over the union, never a slot
 * per member.
 *
 * @typeParam T an `Atom` alias, or a value type
 */
export type Declared<T> = [T] extends [Keyed] ? T : Atom<T>
