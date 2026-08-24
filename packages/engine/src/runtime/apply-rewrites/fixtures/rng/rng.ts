import { XORSHIFT } from './xorshift'

/**
 * A seeded generator of numbers in `[0, 1)` (xorshift32), so a failing
 * property run is reproducible.
 *
 * @param seed the starting state; zero is read as one
 */
export function rng(seed: number): () => number {
  const [a, b, c] = XORSHIFT.shifts
  let s = seed | 0 || 1

  return () => {
    s ^= s << a
    s ^= s >>> b
    s ^= s << c

    return ((s >>> 0) % XORSHIFT.resolution) / XORSHIFT.resolution
  }
}
