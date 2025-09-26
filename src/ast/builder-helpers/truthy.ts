/**
 * Falsy values in JavaScript (excluding `NaN`, which cannot be represented at
 * the type level).
 */
export type Falsy = false | 0 | 0n | "" | null | undefined;

/** Remove falsy constituents from a type. */
export type Truthy<T> = Exclude<T, Falsy>;

/** Value/type guard that refines to `Exclude<T, Falsy>`. */
export type TruthyGuard = <T>(x: T) => x is Truthy<T>;
