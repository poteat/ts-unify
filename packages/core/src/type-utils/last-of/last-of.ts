import type { UnionToIntersection } from '@/type-utils/union-to-intersection'

/**
 * The last member of a union, read off the contravariance of an
 * intersection of function types; the step of the union-to-tuple conversion.
 *
 * @example type Result = LastOf<1 | 2 | 3> // 3
 */
export type LastOf<T> =
  UnionToIntersection<T extends unknown ? () => T : never> extends () => infer R
    ? R
    : never
