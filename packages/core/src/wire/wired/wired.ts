import type { Missing } from '@/wire/missing'
import type { MissingDeps } from '@/wire/missing-deps'
import type { Provider } from '@/wire/provider'

/**
 * The rest parameter of `wire`: the tuple itself when every declared
 * dependency is in it, else a list of the missing ones.
 *
 * The first argument then fails to type-check with the missing provider
 * named.
 *
 * @typeParam R the providers passed, as a tuple of their types
 */
export type Wired<R extends readonly Provider[]> = [Missing<R>] extends [never]
  ? R
  : readonly MissingDeps<Missing<R>>[]
