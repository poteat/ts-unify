import type { Memo } from '@ts-unify/engine/runtime/types'
/**
 * A memo of what a builder makes of each object, built on the first read
 * and kept for the object's lifetime.
 *
 * @param build makes the value of one object
 * @returns an object whose `of` yields the memoized value of a key, building it
 *          on a miss
 */
export function planMemo<K extends object, V>(
  build: (key: K) => V,
): Memo<K, V> {
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
