/**
 * The smallest element of a sorted array that is at or after a bound,
 * or undefined when every element is before it.
 *
 * @param sorted the numbers, ascending
 * @param at the bound
 * @returns the first element at or after the bound, or undefined when all are
 *          before it
 */
export function firstAtOrAfter(
  sorted: readonly number[],
  at: number,
): number | undefined {
  let lo = 0
  let hi = sorted.length

  while (lo < hi) {
    const mid = (lo + hi) >> 1
    sorted[mid] < at ? (lo = mid + 1) : (hi = mid)
  }

  return sorted[lo]
}
