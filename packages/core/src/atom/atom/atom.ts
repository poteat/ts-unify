import type { Declared } from '@/atom/declared'
import type { Definition } from '@/atom/definition'
import type { Deps } from '@/atom/deps'
import type { Filling } from '@/atom/filling'
import type { Keyed } from '@/atom/keyed'
import type { NoDeps } from '@/atom/no-deps'
import type { Of } from '@/atom/of'
import type { Reader } from '@/atom/reader'
import type { ValueOf } from '@/atom/value-of'

import DefinitionOf from './definition-of'
import SlotOf from './slot-of'

/**
 * A slot, given a label or nothing; a definition, given the slot it fills
 * and its read, with the slots it reads between them when it has any.
 *
 * The form is chosen by arity alone: nothing is read off the shape of the
 * read function. A slot's type is given explicitly, its `Atom` alias or an
 * unnamed value type; a definition's is read off the slot it fills.
 *
 * @param label the name error text calls the slot by
 */
export function atom<T>(label?: string): Declared<T>
export function atom<A extends Keyed>(
  slot: A,
  read: () => ValueOf<A>,
): Definition<A, NoDeps>
export function atom<A extends Keyed, const D extends Deps>(
  slot: A,
  deps: D,
  read: (deps: Of<D>) => ValueOf<A>,
): Definition<A, D>
export function atom(
  first?: string | Keyed,
  second?: Deps | Reader,
  third?: Reader,
): Keyed | Filling {
  if (typeof first !== 'object') return SlotOf.slotOf(first)

  if (typeof second === 'function') {
    return DefinitionOf.definitionOf(first, {}, second)
  }

  if (second !== undefined && third !== undefined) {
    return DefinitionOf.definitionOf(first, second, third)
  }

  throw new TypeError('atom takes a label, or a slot, its deps and a read')
}
