import { Equal } from "../equal/equal";

/**
 * Compile-time assertion that two types are exactly equal.
 * Pass `0` as the argument - fails to compile if types don't match.
 *
 * @example
 * assertType<string, string>(0); // ✓ Compiles
 * assertType<string, number>(0); // ✗ Error: type '0' not assignable to 'never'
 * assertType<"hello", string>(0); // ✗ Error: literal vs base type
 *
 * @typeParam T - Actual type
 * @typeParam U - Expected type
 */
export const assertType = <T, U>(val: Equal<T, U> extends true ? 0 : never) =>
  val;
