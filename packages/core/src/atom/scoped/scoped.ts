import type { Filling } from '@/atom/filling'
import type { Fills } from '@/atom/fills'

import type { Refills } from './refills'
import type { Shadowed } from './shadowed'

/**
 * The rest parameter of `scope`: the tuple itself when none of its
 * definitions fills a slot the parent fills, else a list of those slots.
 *
 * @typeParam C the parent store's type, as narrowed at the call
 * @typeParam S the definitions passed, as a tuple of their types
 */
export type Scoped<C, S extends readonly Filling[]> = [
  Shadowed<C, Fills<S[number]>>,
] extends [never]
  ? S
  : readonly Refills<Shadowed<C, Fills<S[number]>>>[]
