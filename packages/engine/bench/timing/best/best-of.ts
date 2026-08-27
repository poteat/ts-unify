import type { Timed } from './types'
import Util from './util'
/**
 * The shortest of several timings of a function, with the result of that
 * run.
 *
 * The first run warms the engine; the best is what the code costs once
 * warm.
 *
 * @param rounds how many times the function runs
 * @param run the function timed
 * @returns the shortest round's milliseconds and what that round returned
 */
export function bestOf<T>(rounds: number, run: () => T): Timed<T> {
  let best = Infinity
  let result!: T

  for (let i = 0; i < rounds; i++) {
    const round = Util.timed(run)

    if (round.ms < best) {
      best = round.ms
      result = round.result
    }
  }

  return { ms: best, result }
}
