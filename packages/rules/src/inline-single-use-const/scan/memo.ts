/**
 * A memo of what a builder makes of each object, built on the first read
 * and kept for the object's lifetime; the builder reads the memo itself
 * for the objects under the one it builds.
 *
 * @param build makes the value of one object, given the memo
 */
export function memo<K extends object, V>(
  build: (key: K, of: (key: K) => V) => V,
): { of: (key: K) => V } {
  const kept = new WeakMap<K, V>()

  const of = (key: K): V => {
    const hit = kept.get(key)
    if (hit) return hit
    const built = build(key, of)
    kept.set(key, built)

    return built
  }

  return { of }
}
