import { Equal } from "../equal/equal";

/**
 * Type-safe expectation helper that enforces exact type equality at compile
 * time while performing runtime value assertions.
 *
 * @example
 * expectType("hello").toBe("hello"); // ✓ Passes
 * expectType(42).toBe(43); // ✗ Runtime error
 * expectType("hello").toBe(42); // ✗ Compile error
 *
 * @param value - The value to check
 * @returns Object with toBe method for type-safe equality checking
 */
export const expectType = <const T>(value: T) => ({
  toBe: <U>(expected: Equal<T, U> extends true ? U : never) => {
    expect(value).toBe(expected);
    return expected;
  },
});
