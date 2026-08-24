import type { KeysOfUnion } from '@/type-utils'

/**
 * One bag from a union of bags: every key any member has, each valued by
 * the union of what the members holding it give.
 */
export type CoalesceUnionOfBags<U> = {
  [K in KeysOfUnion<U>]: U extends unknown
    ? K extends keyof U
      ? U[K]
      : never
    : never
}
