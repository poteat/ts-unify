import type Types from './types'

/**
 * What a builder makes of each object, built on the first read and kept
 * for the object's lifetime.
 *
 * The builder reads the memo itself for the objects under the one it
 * builds.
 *
 * @param build makes the value of one object, given the memo
 * @returns an `of` giving the memoized value for a key, built on its first read
 */
export function memo<K extends object, V>(
  build: (key: K, lookup: (key: K) => V) => V,
): Types.Memo<K, V> {
  const kept = new WeakMap<K, V>()

  function lookup(key: K): V {
    const hit = kept.get(key)
    if (hit) return hit
    const built = build(key, lookup)
    kept.set(key, built)

    return built
  }

  return { of: lookup }
}
