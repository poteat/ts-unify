import type { SingleKeyOf } from '@/type-utils/single-key-of'

/**
 * A bag of one capture, re-keyed under `K`; a bag of any other size passes
 * through as it is.
 */
export type ReKeyIfSingle<Bag, K extends string> = [SingleKeyOf<Bag>] extends [
  never,
]
  ? Bag
  : { [P in K]: Bag extends unknown ? Bag[SingleKeyOf<Bag>] : never }
