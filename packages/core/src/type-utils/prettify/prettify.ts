/**
 * Flattens an intersection of objects into a single clean object type.
 * Improves IDE display of complex intersection types.
 *
 * @example
 * type Result = Prettify<{ a: 1 } & { b: 2 }>;
 * //   ^? { a: 1; b: 2 }
 */
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
