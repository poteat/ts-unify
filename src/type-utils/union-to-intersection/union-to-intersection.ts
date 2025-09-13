/**
 * Converts a union type to an intersection type.
 * Uses distributive conditional types and contravariance.
 *
 * @example
 * type Result = UnionToIntersection<{ a: 1 } | { b: 2 }>;
 * //   ^? { a: 1 } & { b: 2 }
 */
export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;
