import type { Atom } from '@/atom/slot'

/**
 * The value type of a slot's type; `never` for anything that is not one.
 *
 * The name is read along with the value, since `Atom` is invariant in
 * both; any name, or none, gives the value.
 *
 * @typeParam A the slot's type, an `Atom` alias
 */
export type ValueOf<A> =
  A extends Atom<infer Value, infer Name>
    ? [Name] extends [string]
      ? Value
      : never
    : never
