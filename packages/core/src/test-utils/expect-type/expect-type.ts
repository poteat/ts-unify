import Equal from '@/test-utils/equal'

/**
 * A runtime equality check whose expected value must have exactly the type
 * of the checked value, so a mismatch fails to compile.
 *
 * @example expectType('hello').toBe('hello')
 * @example expectType('hello').toBe(42) // compile error
 * @param value the value to check
 * @returns an object whose `toBe` asserts equality and returns its argument
 */
export const expectType = <const T>(value: T) => ({
  toBe: <U>(expected: Equal.Equal<T, U> extends true ? U : never) => {
    expect(value).toBe(expected)

    return expected
  },
})
