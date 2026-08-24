/**
 * A union type turned into an intersection, through a distributive
 * conditional type and the contravariance of a parameter position.
 *
 * @example
 * type R = UnionToIntersection<{ a: 1 } | { b: 2 }> // { a: 1 } & { b: 2 }
 */
export type UnionToIntersection<U> = (
  U extends unknown ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never
