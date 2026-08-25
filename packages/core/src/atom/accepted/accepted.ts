import type { IsFilled } from '@/atom/is-filled'
import type { Keyed } from '@/atom/keyed'
import type { MissingBelow } from '@/atom/missing-below'
import type { MissingDeps } from '@/atom/missing-deps'
import type { Unfilled } from '@/atom/unfilled'

/**
 * The parameter type of `get`: the slot itself when the store fills it
 * and everything its definition reads, else an error type.
 *
 * The error type names the slot not filled, or the slots still missing
 * under it.
 *
 * @typeParam C the store's type, as narrowed at the call
 * @typeParam S the slot asked for
 */
export type Accepted<C, S extends Keyed> = [IsFilled<C, S>] extends [true]
  ? [MissingBelow<C, S>] extends [never]
    ? S
    : MissingDeps<MissingBelow<C, S>>
  : Unfilled<S>
