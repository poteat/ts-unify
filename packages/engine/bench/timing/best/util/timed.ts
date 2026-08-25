/**
 * The milliseconds a function took, with what it returned.
 *
 * @param run the function timed
 */
export function timed<T>(run: () => T): { ms: number; result: T } {
  const start = performance.now()
  const result = run()

  return { ms: performance.now() - start, result }
}
