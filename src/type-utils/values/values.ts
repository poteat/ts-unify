/**
 * Extract all values from an object/array type as a union.
 */
export type Values<T> = T[keyof T];
