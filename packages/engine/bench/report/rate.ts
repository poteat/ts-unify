import { MS_PER_S } from './ms-per-s'

/**
 * A count over a time as a whole number per second, its thousands
 * separated.
 *
 * @param count how many
 * @param ms in how many milliseconds
 */
export const rate = (count: number, ms: number) =>
  Math.round((count * MS_PER_S) / ms).toLocaleString('en-US')
