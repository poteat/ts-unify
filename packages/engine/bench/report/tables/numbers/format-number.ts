import Util from './util'
/**
 * A number with its thousands separated; a fraction under the decimals'
 * bound keeps them.
 *
 * @param n the number
 */
export const formatNumber = (n: number) =>
  n < Util.DECIMALS.below && !Number.isInteger(n)
    ? n.toFixed(Util.DECIMALS.kept)
    : Math.round(n).toLocaleString('en-US')
