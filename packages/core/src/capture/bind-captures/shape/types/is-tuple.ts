/**
 * Whether an array shape has a fixed length, which makes it a tuple.
 *
 * @typeParam S array or tuple shape
 */
export type IsTuple<S extends readonly unknown[]> = number extends S['length']
  ? false
  : true
