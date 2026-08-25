import type { Accepted } from '@/atom/accepted'
import type { Filling } from '@/atom/filling'
import type { Fills } from '@/atom/fills'
import type { Held } from '@/atom/held'
import IsFilling from '@/atom/is-filling'
import IsKeyed from '@/atom/is-keyed'
import type { Keyed } from '@/atom/keyed'
import type { Scoped } from '@/atom/scoped'
import type { Atom } from '@/atom/slot'

import type { Above } from './above'
import Errors from './errors'
import type { Root } from './root'
import RunRead from './run-read'

/**
 * A set of definitions and the values they build: each built once, on
 * first use, in any order. Slots are keyed by their symbol.
 *
 * `R` is the tuple `createStore` passed, or what `add` assertions grew;
 * membership is read through the phantoms, never `R`, since a conditional
 * `add` leaves a union of store types behind.
 *
 * @typeParam R the definitions held, as a tuple of their types
 * @typeParam Parent the store this one falls back to
 */
export class Store<
  R extends readonly Filling[] = [],
  Parent extends Root = Root,
> {
  /**
   * A phantom: the slots filled here and above, in parameter position.
   *
   * A union of narrowed types then accepts a slot only when every branch
   * does.
   */
  readonly accepts?: (slot: Fills<R[number] | Held<Parent>>) => void

  /**
   * A phantom: the definitions held here and above, in parameter
   * position, for the walk `get` makes down a slot's deps.
   */
  readonly holds?: (definition: R[number] | Held<Parent>) => void

  private readonly own: Map<symbol, Filling>
  private readonly memo = new Map<symbol, unknown>()
  private readonly building = new Set<symbol>()

  /**
   * A store over its own definitions, falling back to a parent's door for
   * any other slot.
   *
   * A later definition for a slot replaces an earlier one.
   *
   * @param definitions the definitions this store holds
   * @param above the parent store's door, when there is one
   */
  constructor(
    definitions: readonly Filling[] = [],
    private readonly above?: Above,
  ) {
    this.own = new Map(
      definitions.map(definition => [definition.slot.key, definition]),
    )
  }

  /**
   * Adds a definition, and narrows the binding this is called on to a
   * store that fills its slot.
   *
   * The binding needs an explicit type annotation.
   *
   * @param definition the definition to add
   */
  add<F extends Filling>(
    definition: F,
  ): asserts this is Store<[...R, F], Parent> {
    this.own.set(definition.slot.key, definition)
  }

  /**
   * The value of a slot, built on first use.
   *
   * Only a slot this store or a parent fills, with everything its
   * definition reads, is accepted.
   *
   * @param slot the slot to read
   * @throws when a slot read is unfilled or part of a cycle
   */
  get<T>(slot: Accepted<this, Atom<T>>): T {
    if (IsKeyed.isKeyed(slot)) return this.resolve(slot) as T

    throw new TypeError('get takes an atom')
  }

  /**
   * A child store holding its own definitions apart from this memo, and
   * falling back to this store for the rest.
   *
   * A child fills only slots this store does not.
   *
   * @param definitions the definitions the child holds
   * @throws when a definition fills a slot this store fills already
   */
  scope<const S extends readonly Filling[]>(
    ...definitions: Scoped<this, S>
  ): Store<S, this> {
    if (definitions.every(IsFilling.isFilling)) return this.child(definitions)

    throw new TypeError('scope takes definitions')
  }

  private child<S extends readonly Filling[]>(
    definitions: readonly Filling[],
  ): Store<S, this> {
    const refilled = definitions.find(definition => this.fills(definition.slot))
    if (refilled !== undefined) throw Errors.refilledError(refilled.slot)

    return new Store<S, this>(definitions, {
      resolve: (slot, asker) => this.resolve(slot, asker),
      fills: slot => this.fills(slot),
    })
  }

  private fills(slot: Keyed): boolean {
    return this.own.has(slot.key) || (this.above?.fills(slot) ?? false)
  }

  private resolve(slot: Keyed, asker?: Keyed): unknown {
    const definition = this.own.get(slot.key)
    if (definition !== undefined) return this.build(definition, asker)
    if (this.above !== undefined) return this.above.resolve(slot, asker)

    throw Errors.unfilledError(slot, asker)
  }

  private build(definition: Filling, asker?: Keyed): unknown {
    const key = definition.slot.key
    if (this.memo.has(key)) return this.memo.get(key)
    if (this.building.has(key)) throw Errors.cycleError(definition.slot, asker)
    this.building.add(key)

    try {
      const value = RunRead.runRead(definition, this.depsOf(definition))
      this.memo.set(key, value)

      return value
    } finally {
      this.building.delete(key)
    }
  }

  private depsOf(definition: Filling) {
    return Object.fromEntries(
      Object.entries(definition.deps).map(([name, dep]) => [
        name,
        this.resolve(dep, definition.slot),
      ]),
    )
  }
}
