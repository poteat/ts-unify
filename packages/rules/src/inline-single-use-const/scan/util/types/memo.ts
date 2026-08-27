/**
 * The memoized values by key: one is built on its first read and kept for
 * the key's lifetime.
 */
export type Memo<K extends object, V> = {
  /**
   * The value for a key, built by the builder on its first read.
   */
  of: (key: K) => V
}
