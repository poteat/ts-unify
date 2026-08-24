/**
 * Whether two types are exactly equal, read off TypeScript's variance check
 * on two generic functions; a literal differs from its base type.
 *
 * @example type T1 = Equal<string, string> // true
 * @example type T2 = Equal<string, 'hello'> // false
 * @typeParam A the first type to compare
 * @typeParam B the second type to compare
 */
export type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? true
    : false
