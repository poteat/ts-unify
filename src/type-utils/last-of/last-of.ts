import type { UnionToIntersection } from "../union-to-intersection";

/**
 * Extracts the last element of a union using variance.
 * Helper for union-to-tuple conversion.
 *
 * @example
 * type Result = LastOf<1 | 2 | 3>; // 3
 */
export type LastOf<T> = UnionToIntersection<
  T extends any ? () => T : never
> extends () => infer R
  ? R
  : never;
