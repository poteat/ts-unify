import type { SPREAD_BRAND } from './brand'

/**
 * Sequence-only capture token for a contiguous slice of an array or tuple.
 *
 * A type-level marker; what a slice matches is defined by the consumers.
 *
 * @typeParam Name name the slice binds to
 * @typeParam Elem element type of the captured slice
 */
export type Spread<Name extends string = string, Elem = unknown> = {
  readonly [SPREAD_BRAND]: true
  readonly name: Name

  /**
   * Phantom producer of the slice's element type, absent at runtime.
   */
  readonly value?: () => Elem
}
