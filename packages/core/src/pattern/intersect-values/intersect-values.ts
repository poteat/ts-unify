import type { UnionToIntersection, Values } from '@/type-utils'

/**
 * The property values of `M`, bags, intersected into one bag; `{}` when
 * `M` has no properties.
 */
export type IntersectValues<M> =
  Values<M & {}> extends infer U
    ? [U] extends [never]
      ? {}
      : UnionToIntersection<U>
    : never
