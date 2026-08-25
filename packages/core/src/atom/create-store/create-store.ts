import type { Complete } from '@/atom/complete'
import type { Filling } from '@/atom/filling'
import IsFilling from '@/atom/is-filling'
import Store from '@/atom/store'

/**
 * A store over the definitions given, in any order.
 *
 * The call type-checks only when every slot any of them reads is filled
 * by one of them; a missing slot is named in the error on the first
 * argument.
 *
 * @param definitions the definitions, each filling one slot
 */
export function createStore<const R extends readonly Filling[]>(
  ...definitions: Complete<R>
): Store.Store<R> {
  if (definitions.every(IsFilling.isFilling)) {
    return new Store.Store<R>(definitions)
  }

  throw new TypeError('createStore takes definitions')
}
