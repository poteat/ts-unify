import type { DepsOf } from '@/wire/deps-of'
import type { Provider } from '@/wire/provider'

/**
 * Every provider a member of the tuple declares that the tuple does not
 * hold; `never` when the tuple is complete.
 *
 * Membership is structural: two providers of one shape stand in for each
 * other here, where the runtime tells them apart by reference.
 *
 * @typeParam R the registered providers, as a tuple of their types
 */
export type Missing<R extends readonly Provider[]> = Exclude<
  DepsOf<R[number]>[number],
  R[number]
>
