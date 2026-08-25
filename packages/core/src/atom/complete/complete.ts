import type { Filling } from '@/atom/filling'
import type { Missing } from '@/atom/missing'
import type { MissingDeps } from '@/atom/missing-deps'

/**
 * The rest parameter of `createStore`: the tuple itself when every slot
 * read is filled, else a list of the missing ones.
 *
 * The first argument then fails to type-check with the missing slot named.
 *
 * @typeParam R the definitions passed, as a tuple of their types
 */
export type Complete<R extends readonly Filling[]> = [Missing<R>] extends [
  never,
]
  ? R
  : readonly MissingDeps<Missing<R>>[]
