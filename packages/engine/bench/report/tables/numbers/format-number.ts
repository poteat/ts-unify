import Util from './util'
/**
 * A number with its thousands separated; a fraction under the decimals'
 * bound keeps them.
 *
 * @param n the number
 * @returns the number as text: a small fraction with fixed decimals, else
 *          rounded with thousands separated
 */
export function formatNumber(n: number) {
  const isSmallFraction = n < Util.DECIMALS.below && !Number.isInteger(n)

  return isSmallFraction
    ? n.toFixed(Util.DECIMALS.kept)
    : Math.round(n).toLocaleString('en-US')
}
