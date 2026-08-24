/**
 * Whether a type is `never`; a guard for validation and conditional types.
 *
 * @example type Test = HasNever<never> // true
 * @example type Test2 = HasNever<string> // false
 */
export type HasNever<T> = [T] extends [never] ? true : false
