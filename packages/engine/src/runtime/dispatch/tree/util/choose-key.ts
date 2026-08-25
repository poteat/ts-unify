import type { Row } from '@ts-unify/engine/runtime/dispatch/tree/types'
/**
 * The key of the path the most rows hold a literal at, the first such in
 * row order among equals; null when no row holds any.
 *
 * @param rows the rows
 */
export function chooseKey<E>(rows: readonly Row<E>[]): string | null {
  const counts = new Map<string, number>()

  for (const row of rows) {
    for (const key of new Set(row.literals.map(it => it.key))) {
      counts.set(key, (counts.get(key) ?? 0) + 1)
    }
  }

  let best: string | null = null

  for (const [key, count] of counts) {
    if (best === null || count > (counts.get(best) ?? 0)) best = key
  }

  return best
}
