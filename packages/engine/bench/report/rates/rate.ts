import Util from './util'
/**
 * A count over a time as a whole number per second, its thousands
 * separated.
 *
 * @param count how many
 * @param ms in how many milliseconds
 */
export const rate = (count: number, ms: number) =>
  Math.round((count * Util.MS_PER_S) / ms).toLocaleString('en-US')
