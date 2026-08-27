/**
 * A quantifier over a bound: its chain method, and whether a count
 * satisfies it against the bound.
 */
export type Bound = {
  readonly kind: 'atLeast' | 'atMost' | 'exactly'

  /**
   * Whether a count of `n` satisfies the quantifier at bound `k`.
   */
  readonly holds: (n: number, k: number) => boolean
}
