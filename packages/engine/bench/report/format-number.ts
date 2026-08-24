import { DECIMALS } from './decimals'

/**
 * A number with its thousands separated; a fraction under the decimals'
 * bound keeps them.
 *
 * @param n the number
 */
export const formatNumber = (n: number) =>
  n < DECIMALS.below && !Number.isInteger(n)
    ? n.toFixed(DECIMALS.kept)
    : Math.round(n).toLocaleString('en-US')
