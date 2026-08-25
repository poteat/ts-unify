import type { DepsOf } from '@/wire/deps-of'
import type { Provider } from '@/wire/provider'

import type { Lacking } from './lacking'

/**
 * Every provider reachable from a provider's declared dependencies that
 * the container type does not accept; `never` when it can be built.
 *
 * The walk carries the providers it has visited, so a cycle ends it
 * instead of ending the type checker.
 *
 * @typeParam C the container's type, as narrowed at the call
 * @typeParam P the provider asked for
 * @typeParam Seen the providers already walked
 */
export type MissingBelow<C, P extends Provider, Seen = never> = P extends Seen
  ? never
  :
      | Lacking<C, DepsOf<P>[number]>
      | (DepsOf<P>[number] extends infer Dep
          ? Dep extends Provider
            ? MissingBelow<C, Dep, Seen | P>
            : never
          : never)
