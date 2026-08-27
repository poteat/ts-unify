import type { Bound } from './types'
/**
 * The quantifiers that take a bound: `.atLeast(n)`, `.atMost(n)` and
 * `.exactly(n)`, in the order they are read.
 */
export const BOUNDED: readonly Bound[] = [
  { kind: 'atLeast', holds: (n, k) => n >= k },
  { kind: 'atMost', holds: (n, k) => n <= k },
  { kind: 'exactly', holds: (n, k) => n === k },
]
