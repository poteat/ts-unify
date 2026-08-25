import type { Filling } from '@/atom/filling'

/**
 * Hands a definition the deps object built for it; the one cast over a
 * read.
 *
 * The read's parameter is `never` to the store, which knows the names it
 * built only at runtime.
 *
 * @param definition the definition whose read runs
 * @param deps the values of its deps, by name
 */
export const runRead = (
  definition: Filling,
  deps: Readonly<Record<string, unknown>>,
) => definition.read(deps as never)
