/**
 * Whether a value has no children for a tree walk to descend into: a
 * primitive, a function, null or undefined.
 *
 * @param value the value
 */
export const isLeaf = (value: unknown) =>
  value == null || typeof value !== 'object'
