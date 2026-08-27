/**
 * Whether a value has no children for a tree walk to descend into: a
 * primitive, a function, null or undefined.
 *
 * @param value the value
 * @returns true for null, undefined or any non-object
 */
export const isLeaf = (value: unknown) =>
  value == null || typeof value !== 'object'
