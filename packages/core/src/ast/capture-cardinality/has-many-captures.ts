import type { HasSingleCapture, HasZeroCaptures } from './types'

/**
 * `true` when a node shape declares two or more captures.
 */
export type HasManyCaptures<N> =
  HasZeroCaptures<N> extends true
    ? false
    : HasSingleCapture<N> extends true
      ? false
      : true
