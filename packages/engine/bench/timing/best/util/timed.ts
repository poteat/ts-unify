import type { Timed } from '@bench/timing/best/types'
/**
 * The milliseconds a function took, with what it returned.
 *
 * @param run the function timed
 * @returns the elapsed milliseconds and what the function returned
 */
export function timed<T>(run: () => T): Timed<T> {
  const start = performance.now()
  const result = run()

  return { ms: performance.now() - start, result }
}
