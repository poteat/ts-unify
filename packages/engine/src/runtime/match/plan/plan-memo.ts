/**
 * A memo of what a builder makes of each object, built on the first read
 * and kept for the object's lifetime.
 *
 * @param build makes the value of one object
 */
export function planMemo<K extends object, V>(
  build: (key: K) => V,
): { of: (key: K) => V } {
  const memo = new WeakMap<K, V>()

  return {
    of: key => {
      const hit = memo.get(key)
      if (hit) return hit
      const built = build(key)
      memo.set(key, built)

      return built
    },
  }
}
