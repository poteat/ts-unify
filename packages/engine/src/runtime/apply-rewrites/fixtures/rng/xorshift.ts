/**
 * The xorshift32 generator's shifts, and the modulus that folds a state
 * into a unit interval.
 */
export const XORSHIFT = {
  shifts: [13, 17, 5],
  resolution: 1_000_000,
} as const
