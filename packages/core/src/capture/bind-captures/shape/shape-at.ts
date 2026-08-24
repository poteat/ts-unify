/**
 * The value type a shape holds at a key, or `unknown` when the shape has no
 * such key.
 *
 * @typeParam S reference shape
 * @typeParam K key to read
 */
export type ShapeAt<S, K extends PropertyKey> = K extends keyof S
  ? S[K]
  : unknown
