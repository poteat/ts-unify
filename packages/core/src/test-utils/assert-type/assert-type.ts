import Equal from '@/test-utils/equal'

/**
 * A compile-time assertion that two types are exactly equal: the call takes
 * `0`, and fails to type-check when the types differ.
 *
 * @example assertType<string, string>(0)
 * @example assertType<'hello', string>(0) // error: literal vs base type
 * @typeParam T the actual type
 * @typeParam U the expected type
 */
export const assertType = <T, U>(
  val: Equal.Equal<T, U> extends true ? 0 : never,
) => val
