/**
 * An intersection of objects flattened into one object type, which an IDE
 * displays as a single shape.
 *
 * @example type Result = Prettify<{ a: 1 } & { b: 2 }> // { a: 1; b: 2 }
 */
export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}
