import type { CaptureKeys } from './capture-keys'

/**
 * `true` when a node shape declares no capture.
 */
export type HasZeroCaptures<N> = [CaptureKeys<N>] extends [never] ? true : false
