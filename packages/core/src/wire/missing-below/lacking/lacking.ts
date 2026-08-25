import type { IsRegistered } from '@/wire/is-registered'

/**
 * The members of a union of providers that a container type does not
 * accept.
 *
 * @typeParam C the container's type, as narrowed at the call
 * @typeParam D the providers to check, as a union
 */
export type Lacking<C, D> = D extends unknown
  ? [IsRegistered<C, D>] extends [true]
    ? never
    : D
  : never
