/**
 * Checks if a type is never.
 * Useful for validation and conditional type logic.
 *
 * @example
 * type Test = HasNever<never>; // true
 * type Test2 = HasNever<string>; // false
 */
export type HasNever<T> = [T] extends [never] ? true : false;
