import type { CAPTURE_BRAND } from './brand'

/**
 * Sentinel that marks a position in a pattern for type extraction, keeping
 * its literal name for compile-time pattern matching.
 *
 * @typeParam Name unique identifier of the capture
 * @typeParam Value type of the captured value
 */
export type Capture<Name extends string = string, Value = unknown> = {
  readonly [CAPTURE_BRAND]: true
  readonly name: Name

  /**
   * Phantom producer of the captured value, absent at runtime.
   *
   * A capture yields a node at match time and holds none, so a pattern's
   * type has no writable reach into the AST.
   */
  readonly value?: () => Value
}
