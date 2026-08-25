import type { Keyed } from '@/atom/keyed'
import type { Reads } from '@/atom/reads'

import type { Defining } from './defining'
import type { Lacking } from './lacking'

/**
 * Every slot reachable from a slot's definition that the store type does
 * not fill; `never` when the slot can be built.
 *
 * The walk carries the slots it has visited, so a cycle ends it instead
 * of ending the type checker.
 *
 * @typeParam C the store's type, as narrowed at the call
 * @typeParam S the slot asked for
 * @typeParam Seen the slots already walked
 */
export type MissingBelow<C, S extends Keyed, Seen = never> = S extends Seen
  ? never
  : Reads<Defining<C, S>> extends infer Dep
    ? Dep extends Keyed
      ? Lacking<C, Dep> | MissingBelow<C, Dep, Seen | S>
      : never
    : never
