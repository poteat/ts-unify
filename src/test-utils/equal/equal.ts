/**
 * Checks if two types are exactly equal using TypeScript's type variance.
 * Returns true only if types match exactly, including literal vs base type
 * differences.
 *
 * @example
 * type T1 = Equal<string, string>; // true
 * type T2 = Equal<string, "hello">; // false
 *
 * @typeParam A - First type to compare
 * @typeParam B - Second type to compare
 */
export type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <
  T
>() => T extends B ? 1 : 2
  ? true
  : false;
