import type { ArrayElem, IsTuple } from './types'

/**
 * The type an array shape holds at an index: the position's own type for a
 * tuple, the element type for an array.
 *
 * @typeParam S array or tuple shape
 * @typeParam I index to read
 */
export type ElemAt<S extends readonly unknown[], I extends PropertyKey> =
  IsTuple<S> extends true ? S[I & number] : ArrayElem<S>
