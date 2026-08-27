/**
 * A cache of what a builder makes of each key, held weakly for the key's
 * lifetime.
 */
export type Memo<K, V> = {
  /**
   * The value of a key, built on a miss and kept for the key's lifetime.
   */
  of: (key: K) => V
}
